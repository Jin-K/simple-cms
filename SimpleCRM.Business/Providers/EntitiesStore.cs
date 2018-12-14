using Microsoft.EntityFrameworkCore;
using SimpleCRM.Business.Models;
using SimpleCRM.Data;
using SimpleCRM.Data.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;

namespace SimpleCRM.Business.Providers {

  /// <summary>
  /// The main EntitiesStore class
  /// Provides methods to access entities database tables
  /// </summary>
	public class EntitiesStore {

    /// <summary>
    /// CrmContext's instance.
    /// 
    /// <seealso cref="EntitiesStore.EntitiesStore(CrmContext)" />
    /// </summary>
    readonly CrmContext _crmContext;

    /// <summary>
    /// Constructor
    /// </summary>
    /// <remarks>
    /// Sets <see cref="EntitiesStore._crmContext" /> via DI
    /// </remarks>
    /// <param name="crmContext">main database context of simple-crm</param>
    public EntitiesStore(CrmContext crmContext) => _crmContext = crmContext;

    /// <summary>
    /// Gets all main entities
    /// </summary>
    /// <returns>Returns all main entities as a generic list of <see cref="Entidad" /></returns>
    public async Task<IEnumerable<Entidad>> GetAllEntities()
    => await _crmContext.Entities.Select( e => new Entidad { Id = e.Id, Name = e.Name } ).ToListAsync();

    /// <summary>
    /// Counts total of existing items for an given <paramref name="entity"/>
    /// </summary>
    /// <example>
    /// This example show how to call the <see cref="Count" /> method
    /// <code>
    /// int ExampleCountMethod(EntitiesStore entitiesStore, int case) {
    ///   switch(case) {
    ///     case 1: return entitiesStore.Count("contacts");
    ///     case 2: return entitiesStore.Count("companies");
    ///     case 3: return entitiesStore.Count("actions");
    ///     default: throw new ArgumentException( "only contacts, companies or actions for the moment" );
    ///   }
    /// }
    /// </code>
    /// </example>
    /// <param name="entity">entity name</param>
    /// <returns>Returns the count</returns>
    public int Count(string entity)
    => _crmContext.AsQueryable<object>( entity ).Count();

    /// <summary>
    /// Get all entity items filtered by <paramref name="queryParameters"/>
    /// </summary>
    /// <param name="entity">Entity name for items</param>
    /// <param name="orderBy">Column name for ordering</param>
    /// <param name="descending">True if ordered descending</param>
    /// <param name="page">Page number</param>
    /// <param name="pageCount">Items amount to take</param>
    /// <returns>Returns an ordered chunk of items as a generic <see cref="IEnumerable" /> of <see cref="Item" /></returns>
    public IEnumerable<Item> GetAll(string entity, string orderBy, bool descending, int page, int pageCount) {

			// call special reflection method to get all items of desired table (one of CrmContext's DbSet<> properties)
      IQueryable<IEntidad> _allItems = _crmContext.AsQueryable<IEntidad>( entity );

      // if not trying to order on column "active" (I think this column had an issue with ordering)
      if (!orderBy.StartsWith("active")) {

        // order by desired column, descending or not
        _allItems = _allItems.OrderBy( orderBy, descending );
      }

      // return all items starting from ordered query of IEntidad objects
      return _allItems

        // skip calculated amount depending on PageCount and Page
        .Skip( pageCount * ( page - 1 ) )

        // take amount depending on PageCount
        .Take( pageCount )

        // cast IEntidad object to Item object
        .Select( Item.FromEntidad );

    }

    /// <summary>
    /// Gets an entity item depending on <paramref name="entityName" /> and <paramref name="id" />
    /// </summary>
    /// <param name="entityName">Entity name for items</param>
    /// <param name="id">Id of item</param>
    /// <param name="loadRelatedData">Do we need to load related data ?</param>
    /// <returns>Returns a raw <see cref="IEntidad" /> object</returns>
    public IEntidad GetItem(string entityName, int id, bool loadRelatedData = false) {;

      // prepare query
      var query = $"select * from dbo.{entityName} where dbo.{entityName}.id = {id}";

      // get type of entity (deprecated: type result is not cached)
      var entityType = _crmContext.GetEntityType(entityName);

      // get appropriate DbSet<TEntity> as IQueryable<TEntity>
      var set = _crmContext.Query<IEntidad>(entityType);

      // filter on id
      set = set.FromSql( query );

      // search for properties with "InversePropertyAttribute" in entity type ==> they are includable
      var allLoadablePropertyNames = entityType.AllLoadablePropertyNames();

      // iterate over entityType's properties and search for properties with "InversePropertyAttribute"
      foreach(var propertyName in allLoadablePropertyNames) { 

        // include that property
        set = set.Include( propertyName );
      }
      
      // return item
      return set.FirstOrDefault();

    }    

  }

}

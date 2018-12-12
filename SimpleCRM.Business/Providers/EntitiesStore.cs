#region using statements
using Microsoft.EntityFrameworkCore;
using SimpleCRM.Business.Models;
using SimpleCRM.Data.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;

using SimpleCRM.Business.Extensions;
using SimpleCRM.Data;
#endregion

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
    => _crmContext.AsGenericQueryableSet<object>(entity.UppercaseFirst()).Count();

    /// <summary>
    /// Get all entity items filtered by <paramref name="queryParameters"/>
    /// </summary>
    /// <param name="queryParameters">query and filter parameters</param>
    /// <returns>Returns an ordered chunk of items as a generic <see cref="IEnumerable" /> of <see cref="Item" /></returns>
    public IEnumerable<Item> GetAll(QueryParameters queryParameters) {

      // store entity in variable
      string entity = queryParameters.Query;

      // call special reflection method to get all items of desired table (one of CrmContext's DbSet<> properties)
      IQueryable<IEntidad> _allItems = _crmContext.AsGenericQueryableSet<IEntidad>(entity);

      // if not trying to order on column "active" (I think this column had an issue with ordering)
      if (!queryParameters.OrderBy.StartsWith("active")) {

        // order by desired column, descending or not
        _allItems = _allItems.OrderBy( queryParameters.OrderBy, queryParameters.Descending );
      }

      // return all items starting from ordered query of IEntidad objects
      return _allItems

        // skip calculated amount depending on PageCount and Page
        .Skip( queryParameters.PageCount * ( queryParameters.Page - 1 ) )

        // take amount depending on PageCount
        .Take( queryParameters.PageCount )

        // cast IEntidad object to Item object
        .Select( Item.FromEntidad );
    }

    /// <summary>
    /// Gets an entity item depending on <paramref name="getItemParameters" />.
    /// 
    /// TODO: Recursively delete everything (Item.FromEntidad, ...) from here if it is not usefull
    /// </summary>
    /// <param name="getItemParameters">query and find parameters</param>
    /// <returns>Returns a <see cref="Item" /></returns>
    public Item GetItem(GetItemParameters getItemParameters)
    => Item.FromEntidad(_crmContext.FindById<IEntidad>( getItemParameters.Id, getItemParameters.Entity.UppercaseFirst()));

    /// <summary>
    /// Gets an entity item depending on <paramref name="getItemParameters" />
    /// </summary>
    /// <param name="getItemParameters">query and find parameters</param>
    /// <returns>Returns a raw <see cref="IEntidad" /> object</returns>
    public IEntidad GetItemRaw(GetItemParameters getItemParameters)
    => _crmContext.FindById<IEntidad>( getItemParameters.Id, getItemParameters.Entity.UppercaseFirst());

  }

}

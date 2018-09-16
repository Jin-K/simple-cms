using Microsoft.EntityFrameworkCore;
using SimpleCRM.Business.Models;
using SimpleCRM.Data.Contexts;
using SimpleCRM.Data.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;

namespace SimpleCRM.Business.Providers {
  public class EntitiesStore {

    readonly Dictionary<string, string> entityTypesMap = new Dictionary<string, string> {
      { "Contacts", "Contact" },
      { "Companies", "Company" },
      { "Actions", "Action" },
    };

    const int DEFAULT_ITEMS_PER_PAGE = 15;

    readonly CrmContext _entitiesContext;

    public EntitiesStore(CrmContext entitiesContext) {
      _entitiesContext = entitiesContext;
      _entitiesContext.Database.EnsureCreated();
    }

    public async Task<IEnumerable<Entidad>> GetAllEntities() => 
      await _entitiesContext.Entities.Select( e => new Entidad { Id = e.Id, Name = e.Name } ).ToListAsync();

    public async Task<IEnumerable<Item>> GetAllItems(string entity) {
      IQueryable<Item> items;
      switch (entity) {
        case "Contacts":
          items = _entitiesContext.Contacts.Select( c => new Item { id = c.Id, active = true, dCreate = c.Created } );
          break;
        case "Companies":
          items = _entitiesContext.Companies.Select( c => new Item { id = c.Id, active = true, dCreate = c.Created } );
          break;
        case "Actions":
          items = _entitiesContext.Companies.Select( a => new Item { id = a.Id, active = true, dCreate = a.Created } );
          break;
        default: return new List<Item>();
      }

      return await items.ToListAsync();
    }

    public int Count(string entity) {
      switch (entity) {
        case "Contacts":  return _entitiesContext.Contacts.Count();
        case "Companies": return _entitiesContext.Companies.Count();
        case "Actions":   return _entitiesContext.Actions.Count();
        default: return 0;
      }
    }

    public async Task<PaginatedItemList> QueryItems(string entity, string sort = "", string order = "", int page = 1, int limit = DEFAULT_ITEMS_PER_PAGE) {
      if (!entityTypesMap.ContainsKey( entity )) return null;
      var ret = new PaginatedItemList();

      IQueryable<IEntidad> entidadSet;
      switch(entity) {
        case "Actions":   entidadSet = _entitiesContext.Actions.AsQueryable(); break;
        case "Contacts":  entidadSet = _entitiesContext.Contacts.AsQueryable(); break;
        case "Companies": entidadSet = _entitiesContext.Companies.AsQueryable(); break;
        default: return null;
      }

      if (order == "desc") {
        switch(sort) {
          case "id": entidadSet = entidadSet.OrderByDescending( item => item.Id ); break;
          case "created": entidadSet = entidadSet.OrderByDescending( item => item.Created ); break;
        }
      }
      else {
        switch (sort) {
          case "id": entidadSet = entidadSet.OrderBy( item => item.Id ); break;
          case "created": entidadSet = entidadSet.OrderBy( item => item.Created ); break;
        }
      }

      ret.Count = await entidadSet.LongCountAsync();
      ret.Items = await entidadSet
                    .Skip( --page * limit )
                    .Take( limit )
                    .Select( e => new Item { id = e.Id, active = true, dCreate = e.Created } )
                    .ToListAsync();

      return ret;
    }

    public IEnumerable<Item> GetAll(QueryParameters queryParameters) {
      string entity = queryParameters.Query;
      IQueryable<IEntidad> _allItems;
      switch (entity) {
        case "Actions":   _allItems = _entitiesContext.Actions.AsQueryable(); break;
        case "Contacts":  _allItems = _entitiesContext.Contacts.AsQueryable(); break;
        case "Companies": _allItems = _entitiesContext.Companies.AsQueryable(); break;
        default: return null;
      }

      _allItems = _allItems.OrderBy( queryParameters.OrderBy, queryParameters.Descending );

      return _allItems
        .Skip( queryParameters.PageCount * ( queryParameters.Page - 1 ) )
        .Take( queryParameters.PageCount )
        .Select( e => new Item { id = e.Id, active = true, dCreate = e.Created } );
    }
  }
}

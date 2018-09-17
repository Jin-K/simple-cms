using Microsoft.EntityFrameworkCore;
using SimpleCRM.Business.Models;
using SimpleCRM.Data.Contexts;
using SimpleCRM.Data.Entities;
using System;
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

    public int Count(string entity) {
      switch (entity) {
        case "Contacts":  return _entitiesContext.Contacts.Count();
        case "Companies": return _entitiesContext.Companies.Count();
        case "Actions":   return _entitiesContext.Actions.Count();
        default: throw new ArgumentException( $"Unexpected entity: {entity}" );
      }
    }

    public IEnumerable<Item> GetAll(QueryParameters queryParameters) {
      string entity = queryParameters.Query;

      IQueryable<IEntidad> _allItems;
      switch (entity) {
        case "Actions":   _allItems = _entitiesContext.Actions.AsQueryable(); break;
        case "Contacts":  _allItems = _entitiesContext.Contacts.AsQueryable(); break;
        case "Companies": _allItems = _entitiesContext.Companies.AsQueryable(); break;
        default: throw new ArgumentException( $"Unexpected entity: {entity}" );
      }

      if (!queryParameters.OrderBy.StartsWith("active")) _allItems = _allItems.OrderBy( queryParameters.OrderBy, queryParameters.Descending ); ;

      return _allItems
        .Skip( queryParameters.PageCount * ( queryParameters.Page - 1 ) )
        .Take( queryParameters.PageCount )
        .Select( e => new Item { id = e.Id, active = true, created = e.Created } );
    }

    public Item GetItem(GetItemParameters getItemParameters) {
      var entity = getItemParameters.Entity;
      var id = getItemParameters.Id;

      IEntidad rawObject;
      switch(entity) {
        case "Action": rawObject = _entitiesContext.Actions.Find( id ); break;
        case "Contacts": rawObject = _entitiesContext.Contacts.Find( id ); break;
        case "Companies": rawObject = _entitiesContext.Companies.Find( id ); break;
        default: throw new ArgumentException($"Unexpected entity: {entity}");
      }

      return new Item { id = rawObject.Id, active = true, created = rawObject.Created };
    }
  }
}

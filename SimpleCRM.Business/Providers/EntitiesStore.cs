using Microsoft.EntityFrameworkCore;
using SimpleCRM.Business.Models;
using SimpleCRM.Data.Contexts;
using SimpleCRM.Data.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SimpleCRM.Business.Providers {
  public class EntitiesStore {
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
  }
}

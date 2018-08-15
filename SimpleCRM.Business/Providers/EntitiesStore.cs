using Microsoft.EntityFrameworkCore;
using SimpleCRM.Business.Models;
using SimpleCRM.Data.Contexts;
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
  }
}

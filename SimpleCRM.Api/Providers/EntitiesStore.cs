using SimpleCRM.Api.Models;
using System.Collections.Generic;
using System.Linq;

namespace SimpleCRM.Api.Providers {
  public class EntitiesStore {
    readonly EntitiesContext _entitiesContext;

    public EntitiesStore(EntitiesContext entitiesContext) => _entitiesContext = entitiesContext;

    public List<Entity> GetAllEntities() => _entitiesContext.Entities.ToList();
  }
}

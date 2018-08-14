using SimpleCRM.Data.Contexts;
using SimpleCRM.Data.Entities;
using System.Collections.Generic;
using System.Linq;

namespace SimpleCRM.Business.Providers {
  public class EntitiesStore {
    readonly CrmContext _entitiesContext;

    public EntitiesStore(CrmContext entitiesContext) => _entitiesContext = entitiesContext;

    public List<Entity> GetAllEntities() => _entitiesContext.Entities.ToList();
  }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SimpleCRM.Api.Models;
using SimpleCRM.Api.Providers;
using System.Linq;

namespace SimpleCRM.Api.Controllers {

  [Authorize( AuthenticationSchemes = "Bearer" )]
  [Route( "api/[controller]" )]
  public class EntityController : Controller {
    EntitiesStore _entitiesStore;

    public EntityController(EntitiesStore entitiesStore) => _entitiesStore = entitiesStore;

    public Entidad[] GetAllEntities() =>
      _entitiesStore.GetAllEntities().Select( entity => (Entidad) entity).ToArray();
  }

}

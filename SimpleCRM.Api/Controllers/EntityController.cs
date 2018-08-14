using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SimpleCRM.Api.Providers;
using System.Linq;

namespace SimpleCRM.Api.Controllers {

  [Authorize( AuthenticationSchemes = "Bearer" )]
  [Route( "api/[controller]" )]
  public class EntityController : Controller {
    EntitiesStore _entitiesStore;

    public EntityController(EntitiesStore entitiesStore) => _entitiesStore = entitiesStore;

    [HttpGet]
    public IActionResult GetAllEntities() => 
      Ok( _entitiesStore.GetAllEntities().Select( entity => entity.ToEntidad() ) );
  }

}

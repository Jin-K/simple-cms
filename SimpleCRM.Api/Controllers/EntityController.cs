using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SimpleCRM.Business.Providers;
using System.Threading.Tasks;

namespace SimpleCRM.Api.Controllers {

  [Authorize( AuthenticationSchemes = "Bearer" )]
  [Route( "api/[controller]" )]
  public class EntityController : Controller {
    EntitiesStore _entitiesStore;

    public EntityController(EntitiesStore entitiesStore) => _entitiesStore = entitiesStore;

    [HttpGet]
    public async Task<IActionResult> Get() => Ok( await _entitiesStore.GetAllEntities() );
  }

}

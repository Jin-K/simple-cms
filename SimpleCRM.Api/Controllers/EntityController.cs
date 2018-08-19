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
    public async Task<IActionResult> GetAll() => Ok( await _entitiesStore.GetAllEntities() );

    [HttpGet( "{entidad}" )] // GET api/entity/{entidad}
    public async Task<IActionResult> GetAllItems(string entidad) => Ok( await _entitiesStore.GetAllItems( entidad ) );
  }

}

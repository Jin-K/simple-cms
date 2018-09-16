using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SimpleCRM.Business.Models;
using SimpleCRM.Business.Providers;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SimpleCRM.Api.Controllers {

  [Authorize( AuthenticationSchemes = "Bearer" )]
  [Route( "api/[controller]" )]
  public class EntityController : Controller {
    EntitiesStore _entitiesStore;

    public EntityController(EntitiesStore entitiesStore) => _entitiesStore = entitiesStore;

    // GET api/entity/all
    [HttpGet( Name = nameof( GetAll ) )]
    [Route( "all" )]
    public IActionResult GetAll([FromQuery] QueryParameters queryParameters) {

      List<Item> allItems = _entitiesStore.GetAll(queryParameters).ToList();

      var allItemCount = _entitiesStore.Count(queryParameters.Query);

      var paginationMetadata = new {
        totalCount = allItemCount,
        pageSize = queryParameters.PageCount,
        currentPage = queryParameters.Page,
        totalPages = queryParameters.GetTotalPages(allItemCount)
      };

      Response.Headers.Add( "X-Pagination", JsonConvert.SerializeObject( paginationMetadata ) );

      var links = CreateLinksForCollection(queryParameters, allItemCount);

      //var toReturn = allItems.Select(x => ExpandSingleItem(x));
      var toReturn = allItems;

      return Ok( new {
        value = toReturn,
        links
      } );

    }

    // GET api/entity/entities
    [HttpGet( Name = nameof( GetMainEntities ) )]
    [Route( "entities" )]
    public async Task<IActionResult> GetMainEntities() => Ok( await _entitiesStore.GetAllEntities() );

    #region Helpers
    // TODO: Do I need this ?
    List<object> CreateLinksForCollection(QueryParameters queryParameters, int totalCount) {
      var links = new List<object>();
      return links;
    }
    #endregion
  }

}

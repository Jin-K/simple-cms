using Microsoft.AspNetCore.Mvc;
using SimpleCRM.Business.Providers;
using System.Threading.Tasks;

namespace SimpleCRM.Api.Controllers {
  //[Authorize(AuthenticationSchemes = "Bearer")]
  [Route("api/[controller]")]
  public class NewsController : Controller {
    NewsStore newsStore;

    public NewsController(NewsStore newsStore) => this.newsStore = newsStore;

    [HttpPost]
    public async Task<IActionResult> AddGroup([FromQuery] string group) {
      if (string.IsNullOrEmpty(group)) return BadRequest();
      await newsStore.AddGroup(group);
      return Created("AddGroup", group);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllGroups() => Ok( await newsStore.GetAllGroups() );
  }
}
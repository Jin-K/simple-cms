using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SimpleCRM.Business.Providers;

namespace SimpleCRM.Api.Controllers {
  //[Authorize(AuthenticationSchemes = "Bearer")]
  [Route("api/[controller]")]
  public class NewsController : Controller {
    NewsStore newsStore;

    public NewsController(NewsStore newsStore) => this.newsStore = newsStore;

    [HttpPost]
    public IActionResult AddGroup([FromQuery] string group) {
      if (string.IsNullOrEmpty(group)) return BadRequest();
      newsStore.AddGroup(group);
      return Created("AddGroup", group);
    }

    public List<string> GetAllGroups() {
      return newsStore.GetAllGroups();
    }
  }
}
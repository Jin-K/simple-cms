using System.Collections.Generic;
using api.Providers;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers {
  [Route("api/[controller]")]
  public class NewsController : Controller {
    private NewsStore _newsStore;

    public NewsController(NewsStore newsStore) => _newsStore = newsStore;

    [HttpPost]
    public IActionResult AddGroup([FromQuery] string group) {
      if (string.IsNullOrEmpty(group)) return BadRequest();
      _newsStore.AddGroup(group);
      return Created("AddGroup", group);
    }

    public List<string> GetAllGroups() {
      return _newsStore.GetAllGroups();
    }
  }
}
using SimpleCRM.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace SimpleCRM.Api.Controllers {

  //[Authorize(AuthenticationSchemes = "Bearer")]
  [Route( "api/entity" )]
  public class EntityController : Controller {

    public Entity[] Get() {
      return new Entity[] {
        new Entity { Name = "Action", Value = "Do your job" },
        new Entity { Name = "Action", Value = "Go sleep" }
      };
    }
  }
}
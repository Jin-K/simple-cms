using Microsoft.AspNetCore.Mvc;

namespace SimpleCRM.Auth.Controllers {
  public class HomeController : Controller {
    public IActionResult Index() {
      return View();
    }
  }
}

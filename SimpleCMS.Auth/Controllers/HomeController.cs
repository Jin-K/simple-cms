using Microsoft.AspNetCore.Mvc;

namespace SimpleCMS.Auth.Controllers {
  public class HomeController : Controller {
    public IActionResult Index() {
      return View();
    }
  }
}

using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SimpleCRM.Business.Providers;

namespace SimpleCRM.Api.Controllers {
  [Route("api/[controller]")]
  public class WidgetController : Controller {
    WidgetsStore _widgetsStore;

    public WidgetController(WidgetsStore widgetsStore) => _widgetsStore = widgetsStore;

    [HttpGet]
    public async Task<IActionResult> GetAllWidgets() => Ok( await _widgetsStore.GetAllWidgets() );
  }
}

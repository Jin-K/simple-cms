using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SimpleCRM.Business.Providers;

namespace SimpleCRM.Api.Controllers {

  /// <summary>
  /// The main WidgetController class
  /// </summary>
  [Route("api/[controller]")]
  public class WidgetController : Controller {

    /// <summary>
    /// Store for widgets
    /// </summary>
    WidgetsStore _widgetsStore;

    /// <summary>
    /// Controller
    /// </summary>
    /// <param name="widgetsStore">store for widgets (injected by DI)</param>
    public WidgetController(WidgetsStore widgetsStore) 
    => _widgetsStore = widgetsStore;

    /// <summary>
    /// Gets all widgets
    /// </summary>
    /// <returns>Returns an enumerable of all widgets (generic type: <see cref="SimpleCRM.Data.Entities.Widget" /></returns>
    [HttpGet]
    public async Task<IActionResult> GetAllWidgets()
    => Ok( await _widgetsStore.GetAllWidgets() );

  }

}

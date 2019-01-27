using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SimpleCMS.Business.Providers;

namespace SimpleCMS.Api.Controllers {

  /// <summary>
  /// The main WidgetController class
  /// </summary>
  [Route("api/[controller]")]
  public class WidgetController : ControllerBase {

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
    /// <returns>Returns an enumerable of all widgets (generic type: <see cref="SimpleCMS.Data.Entities.Widget" /></returns>
    [HttpGet]
    public async Task<IActionResult> GetAllWidgets()
    => Ok( await _widgetsStore.GetAllWidgets() );

  }

}

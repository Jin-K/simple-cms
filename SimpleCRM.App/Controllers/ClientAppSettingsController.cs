using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using SimpleCRM.App.ViewModel;

namespace SimpleCRM.App.Controllers {
  [Route("api/[controller]")]
  public class ClientAppSettingsController : Controller {
    readonly ClientAppSettings _clientAppSettings;

    public ClientAppSettingsController(IOptions<ClientAppSettings> clientAppSettings) {
      _clientAppSettings = clientAppSettings.Value;
    }

    [HttpGet]
    public IActionResult Get() {
      return Ok(_clientAppSettings);
    }
  }
}

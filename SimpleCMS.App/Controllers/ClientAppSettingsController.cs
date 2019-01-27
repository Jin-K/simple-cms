using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using SimpleCMS.App.ViewModel;

namespace SimpleCMS.App.Controllers {
  [Route("api/[controller]")]
  public class ClientAppSettingsController : ControllerBase {
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

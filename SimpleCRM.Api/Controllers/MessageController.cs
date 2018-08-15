using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SimpleCRM.Api.Hubs;
using System.Threading.Tasks;

namespace SimpleCRM.Api.Controllers {

  [Authorize(AuthenticationSchemes = "Bearer")]
  [Route( "api/message" )]
  public class MessageController : Controller {
    private IHubContext<MessageHub> _messageHubContext;

    public MessageController(IHubContext<MessageHub> messageHubContext) => _messageHubContext = messageHubContext;

    [HttpPost]
    public async Task<IActionResult> Post() {
      await _messageHubContext.Clients.All.SendAsync( "send", "Hello from the server" ); // Broadcast the message to our clients
      return Ok();
    }
  }
}
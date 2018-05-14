using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using api.Hubs;

namespace api.Controllers {

  [Route( "api/message" )]
  public class MessageController : Controller {
    private IHubContext<MessageHub> _messageHubContext;

    public MessageController(IHubContext<MessageHub> messageHubContext) => _messageHubContext = messageHubContext;

    public IActionResult Post() {
      // Broadcast the message to our clients
      _messageHubContext.Clients.All.SendAsync( "send", "Hello from the server" );
      return Ok();
    }
  }
}
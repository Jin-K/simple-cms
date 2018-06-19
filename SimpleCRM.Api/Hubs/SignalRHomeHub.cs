using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace SimpleCRM.Api.Hubs {
  [Authorize(AuthenticationSchemes = "Bearer")]
  public class SignalRHomeHub : Hub {
    public Task Send(string data) {
      return Clients.All.SendAsync("Send", data);
    }
  }
}

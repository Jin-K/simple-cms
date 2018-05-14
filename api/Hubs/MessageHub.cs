using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace api.Hubs {
  public class MessageHub : Hub {
    public override Task OnConnectedAsync() {
      Trace.TraceInformation("client connected");
      return base.OnConnectedAsync();
    }
    public Task Send(string message) {
      return Clients.All.SendAsync("Send", message);
    }
  }
}
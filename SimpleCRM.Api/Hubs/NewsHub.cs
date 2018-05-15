using System;
using System.Threading.Tasks;
using System.Diagnostics;

using Microsoft.AspNetCore.SignalR;

using SimpleCRM.Api.Models.SignalR;
using SimpleCRM.Api.Providers;

namespace SimpleCRM.Api.Hubs {
  public class NewsHub : Hub {

    private NewsStore _newsStore;
    public NewsHub(NewsStore newsStore) {
      _newsStore = newsStore;
    }
    
    //public override Task OnConnectedAsync() {
    //  Trace.TraceInformation("client connected to news");
    //  return base.OnConnectedAsync();
    //}

    public Task Send(NewsItem newsItem) {
      if (!_newsStore.GroupExists(newsItem.NewsGroup))
        throw new Exception( "Cannot send a news item to a group which does not exist." );
      
      _newsStore.CreateNewItem(newsItem);
      return Clients.Group(newsItem.NewsGroup).SendAsync("Send", newsItem);
    }

    public async Task JoinGroup(string groupName) {
      if (!_newsStore.GroupExists(groupName))
        throw new Exception("cannot join a group which does not exist.");
      
      await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
      await Clients.Group(groupName).SendAsync("JoinGroup", groupName);

      var history = _newsStore.GetAllNewsItems(groupName);
      await Clients.Client(Context.ConnectionId).SendAsync("History", history);
    }

    public async Task LeaveGroup(string groupName) {
      if (!_newsStore.GroupExists(groupName))
        throw new Exception("Cannot leave a group which does not exist.");
      
      await Clients.Group(groupName).SendAsync("LeaveGroup", groupName);
      await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
    }
  }
}
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Threading.Channels;
using System.Threading.Tasks;
using SimpleCRM.Common;

namespace SimpleCRM.Api.Hubs {
	public class DashboardHub : Hub {

		/// <summary>
		/// Hashset containing connection ids
		/// </summary>
		readonly HashSet<string> connectedIds = new HashSet<string>();

		/// <summary>
		/// Custom workaround for performance counters (PerformanceCounter class)
		/// </summary>
		readonly IMetricsUtil metricsUtil;
    

    /// <summary>
    /// Constructor
    /// </summary>
		public DashboardHub(IMetricsUtil _metricsUtil) => metricsUtil = _metricsUtil;

		/// <summary>
		/// Called each time a client connects
		/// </summary>
		public override Task OnConnectedAsync() {
			// add to hashset
			connectedIds.Add(Context.ConnectionId);

			// return base method
			return base.OnConnectedAsync();
		}

		/// <summary>
		/// Called each time a client disconnects
		/// </summary>
		/// <param name="exception"></param>
		public override Task OnDisconnectedAsync(Exception exception) {
			// remove from hashset
			connectedIds.Remove(Context.ConnectionId);

			// return base method
			return base.OnDisconnectedAsync(exception);
		}

		/// <summary>
		/// Starts broadcasting data of server's performance watching for cpu changes.
		/// </summary>
		/// <param name="machines"></param>
		/// <param name="delay"></param>
		/// <returns>A </returns>
		public async Task<ChannelReader<object>> Monitor() {
			// create an unbounded channel
			var channel = Channel.CreateUnbounded<object>();

      // broadcast once at begin
      await channel.Writer.WriteAsync(new { Environment.MachineName, Type = "CPU", value = this.metricsUtil.ProcessorUsage });
      await channel.Writer.WriteAsync(new { Environment.MachineName, Type = "Memory", value = this.metricsUtil.WorkingSet64 });

			// attach event handler on cpu usage changes
			this.metricsUtil.ProcessorUsageChanged += new ProcessorUsageChangedEventHandler(async (cpu) => {

				// broadcast to client
				await channel.Writer.WriteAsync(new { Environment.MachineName, Type = "CPU", value = cpu });

			});

			// attach evnet handler on memory changes
			this.metricsUtil.WorkingSet64Changed += new WorkingSet64ChangedEventHandler(async (memory) => {

				// broadcast
				await channel.Writer.WriteAsync(new { Environment.MachineName, Type = "Memory", value = memory });
			});

			// get the readable half of this channel
			return channel.Reader;
		}

	}
}

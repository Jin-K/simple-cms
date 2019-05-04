using Microsoft.AspNetCore.SignalR;
using SimpleCMS.Common;
using System;
using System.Collections.Generic;
using System.Threading.Channels;
using System.Threading.Tasks;

namespace SimpleCMS.Api.Hubs {
	public class DashboardHub : Hub {

		/// <summary>
		/// Hashset containing connection ids
		/// </summary>
		private readonly HashSet<string> _connectedIds = new HashSet<string>();

		/// <summary>
		/// Custom workaround for performance counters (PerformanceCounter class)
		/// </summary>
		private readonly IMetricsUtil _metricsUtil;

		/// <summary>
		/// Constructor
		/// </summary>
		public DashboardHub(IMetricsUtil metricsUtil) => _metricsUtil = metricsUtil;

		/// <summary>
		/// Called each time a client connects
		/// </summary>
		/// <inheritdoc />
		public override Task OnConnectedAsync() {

			// add to hashset
			_connectedIds.Add( Context.ConnectionId );

			// return base method
			return base.OnConnectedAsync();

		}

		/// <summary>
		/// Called each time a client disconnects
		/// </summary>
		/// <param name="exception">exception received after disconnection</param>
		/// <inheritdoc />
		public override Task OnDisconnectedAsync(Exception exception) {

			// remove from hashset
			_connectedIds.Remove( Context.ConnectionId );

			// return base method
			return base.OnDisconnectedAsync( exception );

		}

		/// <summary>
		/// Starts broadcasting data of server's performance watching for cpu changes.
		/// </summary>
		/// <returns>A child instance of <see cref="ChannelReader{T}"/> for reading from channel</returns>
		public async Task<ChannelReader<object>> Monitor() {

			// create an unbounded channel
			var channel = Channel.CreateUnbounded<object>();

			// broadcast once at begin
			await channel.Writer.WriteAsync( new { Environment.MachineName, Type = "CPU", value = _metricsUtil.ProcessorUsage } );
			await channel.Writer.WriteAsync( new { Environment.MachineName, Type = "Memory", value = _metricsUtil.WorkingSet64 } );

			// attach event handler on cpu usage changes
			_metricsUtil.ProcessorUsageChanged += async cpu => {

				// broadcast to client
				await channel.Writer.WriteAsync( new { Environment.MachineName, Type = "CPU", value = cpu } );

			};

			// attach event handler on memory changes
			_metricsUtil.WorkingSet64Changed += async memory => {

				// broadcast
				await channel.Writer.WriteAsync( new { Environment.MachineName, Type = "Memory", value = memory } );
			};

			// get the readable half of this channel
			return channel.Reader;

		}

	}

}

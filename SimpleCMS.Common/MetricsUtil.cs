using System;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;

namespace SimpleCMS.Common {

	public class MetricsUtil : IMetricsUtil {

		#region Private members (used internally by running process)
		private TimeSpan _lastProcessorTime = Process.GetCurrentProcess().TotalProcessorTime;
		private DateTime _lastMeasuredMoment = DateTime.UtcNow;
		#endregion

		/// <summary>
		/// Event that is triggered each time we have a new value for CPU usage
		/// </summary>
		public event ProcessorUsageChangedEventHandler ProcessorUsageChanged;

		/// <summary>
		/// Event that is triggered each time we have a new value for memory
		/// </summary>
		public event WorkingSet64ChangedEventHandler WorkingSet64Changed;

		/// <summary>
		/// Unique instance of this class
		/// </summary>
		public static readonly MetricsUtil Singleton = new MetricsUtil();

		/// <summary>
		/// Used memory for this application expressed in bytes
		/// </summary>
		public long WorkingSet64 { get; private set; } = Process.GetCurrentProcess().WorkingSet64;

		/// <summary>
		/// Last measured CPU usage of this application expressed in percentage
		/// </summary>
		public double ProcessorUsage { get; private set; } = .0;

		/// <summary>
		/// Static constructor
		/// Should be invoked on app start via a simple reference to one of the public properties
		/// </summary>
		static MetricsUtil() => _ = Singleton.MonitorPerformance(); // triche sur syntaxe pour appeler méthode asynchrone depuis méthode synchrone sans pour autant bloquer le thread appellant

		/// <summary>
		/// Watch to machine's performance on an apart thread, setting values of the public properties
		/// </summary>
		[SuppressMessage( "ReSharper", "FunctionNeverReturns" )]
		private async Task MonitorPerformance(int refreshDelay = 75) {

			// get the amount / total of processors that the machine has
			var processorsCount = Environment.ProcessorCount;

			// infinite loop
			while (true) {

				// call getters once
				var currentProcess = Process.GetCurrentProcess();
				var utcNow = DateTime.UtcNow;

				// set memory value
				if (WorkingSet64 != currentProcess.WorkingSet64) {
					WorkingSet64 = currentProcess.WorkingSet64;

					// call memory change event handlers
					DispatchEvent( WorkingSet64 );
				}

				if (currentProcess.TotalProcessorTime != _lastProcessorTime) {

					// set the new CPU usage value
					ProcessorUsage = currentProcess.TotalProcessorTime.Subtract(
					  _lastProcessorTime ).TotalMilliseconds /
					  ( processorsCount * utcNow.Subtract( _lastMeasuredMoment ).TotalMilliseconds
					) * 100;

					// if event handlers for cpu usage changes are attached
					DispatchEvent( ProcessorUsage );

					// set new values for next iteration
					_lastProcessorTime = currentProcess.TotalProcessorTime;
					_lastMeasuredMoment = utcNow;
				}

				// wait for the refresh delay
				await Task.Delay( refreshDelay );

			}

		}

		private void DispatchEvent(object value) {

			switch (value) {
			case long _ when WorkingSet64Changed != null:
				DispatchEventWithParams( WorkingSet64Changed.GetInvocationList(), new[] { value } );
				break;
			case double doubleVal when ProcessorUsageChanged != null:
				DispatchEventWithParams( ProcessorUsageChanged.GetInvocationList(), new object[] { (float) Math.Round( doubleVal, 2 ) } );
				break;
			}

		}

		private static void DispatchEventWithParams(Delegate[] callbacks, object[] _params) {
			foreach (var dlg in callbacks) dlg.Method.Invoke( dlg.Target, _params );
		}

	}

}

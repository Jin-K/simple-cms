using System;
using System.Diagnostics;
using System.Threading.Tasks;

namespace SimpleCRM.Common {

	public delegate void ProcessorUsageChangedEventHandler(float cpu);
  public delegate void WorkingSet64ChangedEventHandler(long memory);

  public interface IMetricsUtil {
    event ProcessorUsageChangedEventHandler ProcessorUsageChanged;
    event WorkingSet64ChangedEventHandler WorkingSet64Changed;
    long WorkingSet64 { get; }
    double ProcessorUsage { get; }
  }

	public class MetricsUtil : IMetricsUtil {

    #region Private members (used internally)
    TimeSpan lastProcessorTime = Process.GetCurrentProcess().TotalProcessorTime;
    DateTime lastMesuredMoment = DateTime.UtcNow;
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
    /// </summaey>
    public static readonly MetricsUtil Singleton = new MetricsUtil();

		/// <summary>
		/// Used memory for this application expressed in bytes
		/// </summary>
    public long WorkingSet64 { get; private set; } = Process.GetCurrentProcess().WorkingSet64;

    /// <summary>
    /// Last mesured CPU usage of this application expressed in percentage
    /// </summary>
    public double ProcessorUsage { get; private set; } = .0;

    /// <summary>
    /// Static constructor
    /// Should be invoked on app start via a simple reference to one of the public properties
    /// </summary>
    static MetricsUtil() => _ = Singleton.MonitorPerformance(); // triche sur syntaxe pour appeler méthode asynchrone depuis méthode synchrone sans pour autant bloquer le thread appelant

    /// <summary>
    /// Watch to machine's performance on an apart thread, setting values of the public properties
    /// </summary>
    async Task MonitorPerformance(int refreshDelay = 75) {

      // get the amount / total of processors that the machine has
      var processorsCount = Environment.ProcessorCount;

      // infinite loop
      while(true) {

        // call getters once
        var currentProcess = Process.GetCurrentProcess();
        var utcNow = DateTime.UtcNow;
        
        // set memory value
        if (WorkingSet64 != currentProcess.WorkingSet64) {
          WorkingSet64 = currentProcess.WorkingSet64;

          // call memory change event handlers
          DispatchEvent(WorkingSet64);
        }

        if (currentProcess.TotalProcessorTime != lastProcessorTime) {

          // set the new CPU usage value
          ProcessorUsage = currentProcess.TotalProcessorTime.Subtract(
            lastProcessorTime).TotalMilliseconds /
            (processorsCount * utcNow.Subtract(lastMesuredMoment).TotalMilliseconds
          ) * 100;

          // if event handlers for cpu usage changes are attached
          DispatchEvent(ProcessorUsage);

          // set new values for next iteration
          lastProcessorTime = currentProcess.TotalProcessorTime;
          lastMesuredMoment = utcNow;
        }

        // wait for the refresh delay
        await Task.Delay(refreshDelay);

      }

    }

	  private void DispatchEvent<T>(T value) where T : struct {

      if (value is long && WorkingSet64Changed != null)
        DispatchEventWithParams(WorkingSet64Changed.GetInvocationList(), new object[] { (T) value });
      
      if (value is double && ProcessorUsageChanged != null)
        DispatchEventWithParams(ProcessorUsageChanged.GetInvocationList(), new object[] { (float) Math.Round( Convert.ToDouble(value), 2) });

    }

    void DispatchEventWithParams(Delegate[] callbacks, object[] _params) {
      foreach(var dlg in callbacks) dlg.Method.Invoke(dlg.Target, _params);
    }

	}

}

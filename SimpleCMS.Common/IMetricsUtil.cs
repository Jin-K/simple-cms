namespace SimpleCMS.Common {

	/// <summary>
	/// The main ProcessorUsageChangedEventHandler delegate 
	/// </summary>
	/// <param name="cpu">cpu usage of current dotnet process (percentage)</param>
	public delegate void ProcessorUsageChangedEventHandler(float cpu);

	/// <summary>
	/// The main WorkingSet64ChangedEventHandler delegate 
	/// </summary>
	/// <param name="memory">memory usage of current dotnet process (MB)</param>
	public delegate void WorkingSet64ChangedEventHandler(long memory);

	/// <summary>
	/// The main IMetricsUtil interface
	/// </summary>
	public interface IMetricsUtil {

		/// <summary>
		/// The main ProcessorUsageChanged event
		/// </summary>
		event ProcessorUsageChangedEventHandler ProcessorUsageChanged;

		/// <summary>
		/// The main WorkingSet64Changed event
		/// </summary>
		event WorkingSet64ChangedEventHandler WorkingSet64Changed;

		/// <summary>
		/// The main WorkingSet64 property
		/// </summary>
		long WorkingSet64 { get; }

		/// <summary>
		/// The main ProcessorUsage property
		/// </summary>
		double ProcessorUsage { get; }

	}

}

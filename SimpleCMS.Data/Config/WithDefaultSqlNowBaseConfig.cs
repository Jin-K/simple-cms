namespace SimpleCMS.Data.Config {

	/// <summary>
	/// The main WithDefaultSqlNowBaseConfig class.
	/// </summary>
	public class WithDefaultSqlNowBaseConfig {
		
		/// <summary>
		/// Sql statement to get sql NOW datetime ==> getdate(), now(), datetime('now'), ...
		/// </summary>
		protected readonly string DefaultNowSql;

		/// <summary>
		/// The main constructor used to initialize the default now sql statement
		/// </summary>
		/// <param name="isSqlServer"></param>
		protected WithDefaultSqlNowBaseConfig(bool isSqlServer) => DefaultNowSql = isSqlServer ? "getdate()" : "datetime('now')";

	}

}

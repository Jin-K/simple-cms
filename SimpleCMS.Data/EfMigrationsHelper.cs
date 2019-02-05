using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System.Reflection;
using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Options;

namespace SimpleCMS.Data {

	/// <summary>
	/// The main TemporaryCmsContext class
	/// Class used by EF migrations
	/// </summary>
	public class TemporaryCmsContext : IDesignTimeDbContextFactory<CmsContext> {

		public CmsContext CreateDbContext(string[] args) {
			var builder = new DbContextOptionsBuilder<CmsContext>();
			var migration = typeof( CmsContext ).GetTypeInfo().Assembly.GetName().Name;
			builder.UseSqlServer( CmsContext.HcConnectionString, b => b.MigrationsAssembly( migration ) );
			return new CmsContext( builder.Options );
		}

	}

	/// <summary>
	/// The main TemporaryPersistedGrantDbContext class
	/// Class used by EF migrations
	/// </summary>
	public class TemporaryPersistedGrantDbContext : IDesignTimeDbContextFactory<PersistedGrantDbContext> {

		public PersistedGrantDbContext CreateDbContext(string[] args) {
			var builder = new DbContextOptionsBuilder<PersistedGrantDbContext>();
			var migration = typeof( CmsContext ).GetTypeInfo().Assembly.GetName().Name;
			builder.UseSqlServer( CmsContext.HcConnectionString, b => b.MigrationsAssembly( migration ) );
			var opOptions = new OperationalStoreOptions { DefaultSchema = "auth" };
			return new PersistedGrantDbContext( builder.Options, opOptions );
		}

	}

	/// <summary>
	/// The main TemporaryConfigurationDbContext class
	/// Class used by EF migrations
	/// </summary>
	public class TemporaryConfigurationDbContext : IDesignTimeDbContextFactory<ConfigurationDbContext> {

		public ConfigurationDbContext CreateDbContext(string[] args) {
			var builder = new DbContextOptionsBuilder<ConfigurationDbContext>();
			var migration = typeof( CmsContext ).GetTypeInfo().Assembly.GetName().Name;
			builder.UseSqlServer( CmsContext.HcConnectionString, b => b.MigrationsAssembly( migration ) );
			var storeOptions = new ConfigurationStoreOptions { DefaultSchema = "auth" };
			return new ConfigurationDbContext( builder.Options, storeOptions );
		}

	}

}

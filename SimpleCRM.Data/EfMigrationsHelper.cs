using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System.Reflection;
using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Options;

namespace SimpleCRM.Data {
	public class TemporaryCrmContext : IDesignTimeDbContextFactory<CrmContext> {
		public CrmContext CreateDbContext(string[] args) {
      var builder = new DbContextOptionsBuilder<CrmContext>();
      var migration = typeof(CrmContext).GetTypeInfo().Assembly.GetName().Name;
      builder.UseSqlServer(CrmContext.HC_CONNECTION_STRING, b => b.MigrationsAssembly(migration));
      return new CrmContext(builder.Options);
		}
	}

  public class TemporaryPersistedGrantDbContext : IDesignTimeDbContextFactory<PersistedGrantDbContext>
  {
    public PersistedGrantDbContext CreateDbContext(string[] args)
    {
      var builder = new DbContextOptionsBuilder<PersistedGrantDbContext>();
      var migration = typeof(CrmContext).GetTypeInfo().Assembly.GetName().Name;
      builder.UseSqlServer(CrmContext.HC_CONNECTION_STRING, b => b.MigrationsAssembly(migration));
      var opOptions = new OperationalStoreOptions { DefaultSchema = "auth" };
      return new PersistedGrantDbContext(builder.Options, opOptions);
    }
  }

  public class TemporaryConfigurationDbContext : IDesignTimeDbContextFactory<ConfigurationDbContext>
  {
    public ConfigurationDbContext CreateDbContext(string[] args)
    {
      var builder = new DbContextOptionsBuilder<ConfigurationDbContext>();
      var migration = typeof(CrmContext).GetTypeInfo().Assembly.GetName().Name;
      builder.UseSqlServer(CrmContext.HC_CONNECTION_STRING, b => b.MigrationsAssembly(migration));
      var storeOptions = new ConfigurationStoreOptions { DefaultSchema = "auth" };
      return new ConfigurationDbContext(builder.Options, storeOptions);
    }
  }
}

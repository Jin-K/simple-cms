using IdentityServer4.EntityFramework.DbContexts;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace SimpleCRM.Data.Extensions {
  public static class AppBuilderExtensions {
    public static void InitializeDatabase(this IApplicationBuilder application) {
      using (var serviceScope = application.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope()) {
        var dbContext = serviceScope.ServiceProvider.GetRequiredService<CrmContext>();
        dbContext.Database.Migrate();
        serviceScope.ServiceProvider.GetRequiredService<PersistedGrantDbContext>().Database.Migrate();
        serviceScope.ServiceProvider.GetRequiredService<ConfigurationDbContext>().Database.Migrate();
      }
    }

	}
}

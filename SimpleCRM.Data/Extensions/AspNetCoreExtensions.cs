using IdentityServer4.EntityFramework.DbContexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SimpleCRM.Data;

namespace Microsoft.AspNetCore {

  /// <summary>
  /// Custom extensions for ASP.NET core things.
  /// 
  /// <seealso cref="Microsoft.AspNetCore" />
  /// </summary>
	public static partial class CustomExtensions {

    /// <summary>
    /// Converts first char of any string ( <paramref name="str" /> ) to upperCase
    /// </summary>
    /// <param name="str">original string to convert</param>
    /// <returns>Returns result in a new string</returns>
    
    /// <summary>
    /// Initializes databases during "SimpleCRM.Auth.StartUp.Configure()"
    /// </summary>
    /// <param name="application">App on which database should be initialized</param>
    public static void InitializeDatabase(this Builder.IApplicationBuilder application) {

      // create (via factory) and use service scope
      using (var serviceScope = application.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope()) {

        // get main context (CrmContext)
        var dbContext = serviceScope.ServiceProvider.GetRequiredService<CrmContext>();

        // migrate main context (crm)
        dbContext.Database.Migrate();

        // migrate other contexts
        serviceScope.ServiceProvider.GetRequiredService<PersistedGrantDbContext>().Database.Migrate();
        serviceScope.ServiceProvider.GetRequiredService<ConfigurationDbContext>().Database.Migrate();
      }

    }

	}

}

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using SimpleCRM.App.ViewModel;
using System;
using System.Linq;

namespace SimpleCRM.App {
  public class Startup {
    public IConfigurationRoot Configuration { get; }
    public Startup(IHostingEnvironment env) {
      Log.Logger = new LoggerConfiguration()
        .MinimumLevel.Verbose()
        .Enrich.WithProperty("App", "SimpleCRM.App")
        .Enrich.FromLogContext()
        .WriteTo.Seq("http://localhost:5341")
        .WriteTo.RollingFile("../Logs/App")
        .CreateLogger();

      Configuration = new ConfigurationBuilder()
        .SetBasePath( env.ContentRootPath )
        .AddJsonFile( "appsettings.json", optional: true, reloadOnChange: true )
        .AddJsonFile( $"appsettings.{env.EnvironmentName}.json", optional: true )
        .AddEnvironmentVariables().Build();
    }

    public void ConfigureServices(IServiceCollection services) {
      services.Configure<ClientAppSettings>(Configuration.GetSection("ClientAppSettings"));

      services.AddCors( options => {
        options.AddPolicy(
          "AllowAllOrigins",
          builder => builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()
        );
      } );

      services.AddMvc().SetCompatibilityVersion( Microsoft.AspNetCore.Mvc.CompatibilityVersion.Version_2_1 );
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env) {

      var angularRoutes = new[] {
        "/entity",
        "/chat",
        "/news"
      };

      app.Use( 
        async (context, next) => {
          if (
            context.Request.Path.HasValue
            && !context.Request.Path.Value.Split( '/' ).Last().Contains( '.' )
            && null != angularRoutes.FirstOrDefault(ar => context.Request.Path.Value.StartsWith(ar, StringComparison.OrdinalIgnoreCase))
          ) {
            context.Request.Path = new Microsoft.AspNetCore.Http.PathString( "/" );
          }

          await next();
        } )
        .UseCors( "AllowAllOrigins" )
        .UseDefaultFiles()
        .UseStaticFiles()
        .UseMvc( routes => {
          routes.MapRoute(
            name: "default",
            template: "{controller=Home}/{action=Index}/{Id?}"
          );
        } );


    }
  }
}

using System;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using SimpleCMS.App.ViewModel;

namespace SimpleCMS.App {

  /// <summary>
  /// The main Startup class
  /// </summary>
  public class Startup {

    /// <summary>
    /// The main Configuration property
    /// </summary>
    private IConfigurationRoot Configuration { get; }

    /// <summary>
    /// Constructor
    /// </summary>
    /// <param name="env">web hosting environment</param>
    public Startup(IHostingEnvironment env) {

      // create logger
      Log.Logger = new LoggerConfiguration()
        .MinimumLevel.Verbose()
        .Enrich.WithProperty("App", "SimpleCMS.App")
        .Enrich.FromLogContext()
        .WriteTo.Seq("http://localhost:5341")
        .WriteTo.RollingFile("../Logs/App")
        .CreateLogger();

      // build configuration property
      Configuration = new ConfigurationBuilder()
        .SetBasePath( env.ContentRootPath )
        .AddJsonFile( "appsettings.json", optional: true, reloadOnChange: true )
        .AddJsonFile( $"appsettings.{env.EnvironmentName}.json", optional: true )
        .AddEnvironmentVariables().Build();

    }

    /// <summary>
    /// The main ConfigureServices method
    /// </summary>
    /// <param name="services">collection of services for dependency injection</param>
    public void ConfigureServices(IServiceCollection services) {

      // register "ClientAppSettings" section from configuration as instance of "ClientAppSettings" class
      services.Configure<ClientAppSettings>(Configuration.GetSection("ClientAppSettings"));

      // add cors
      services.AddCors( options => {
        options.AddPolicy(
          "AllowAllOrigins",
          builder => builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()
        );
      } );

      // add mvc
      services.AddMvc().SetCompatibilityVersion( Microsoft.AspNetCore.Mvc.CompatibilityVersion.Version_2_1 );

    }

    /// <summary>
    /// The main Configure method
    /// </summary>
    /// <remarks>
    /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    /// </remarks>
    /// <param name="app">application builder</param>
    /// <param name="env">web hosting environment</param>
    public void Configure(IApplicationBuilder app, IHostingEnvironment env) {

      // main angular routes
      var angularRoutes = new[] {
        "/auth",
        "/apps",
        "/entity",
        "/errors"
      };

      // middleware for angular routes
      app.Use(async (context, next) => {

        // if angular route
        if (
          context.Request.Path.HasValue // if value for path
          && !context.Request.Path.Value.Split( '/' ).Last().Contains( '.' ) // if no resource file (path doesn't contain '.'à
          && angularRoutes.Any(ar => context.Request.Path.Value.StartsWith(ar, StringComparison.OrdinalIgnoreCase)) // if path starts with one of angular main routes
        ) {

          // set request path to root path "/"
          context.Request.Path = new Microsoft.AspNetCore.Http.PathString( "/" );

        }

        // go next middleware
        await next();

      });

      // use cors
      app.UseCors( "AllowAllOrigins" );

      // use static files for angular resources in wwwroot
      app.UseDefaultFiles().UseStaticFiles();

      // use mvc
      app.UseMvc( routes => {
          routes.MapRoute(
            name: "default",
            template: "{controller=Home}/{action=Index}/{Id?}"
          );
        } );

    }

  }

}

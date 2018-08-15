using IdentityServer4.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Serilog;
using SimpleCRM.Auth.Data;
using SimpleCRM.Auth.Models;
using SimpleCRM.Auth.Services;

namespace SimpleCRM.Auth {
  public class Startup {
    public IConfigurationRoot Configuration { get; }
    readonly IHostingEnvironment _environment;
    string _clientId = "";
    string _clientSecret = "";

    public Startup(IHostingEnvironment env) {
      Log.Logger = new LoggerConfiguration()
        .MinimumLevel.Verbose()
        .Enrich.WithProperty( "App", "SimpleCRM.Auth" )
        .Enrich.FromLogContext()
        .WriteTo.Seq( "http://localhost:5341" )
        .WriteTo.RollingFile( "../Logs/Auth" )
        .CreateLogger();

      var builder = new ConfigurationBuilder()
        .SetBasePath( env.ContentRootPath )
        .AddJsonFile( "appsettings.json", optional: true, reloadOnChange: true )
        .AddJsonFile( $"appsettings.{env.EnvironmentName}.json", optional: true );

      if (env.IsDevelopment()) builder.AddUserSecrets( "AspNetCoreID4External...." );

      _environment = env;

      builder.AddEnvironmentVariables();
      Configuration = builder.Build();
    }

    // This method gets called by the runtime. Use this method to add services to the container.
    // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
    public void ConfigureServices(IServiceCollection services) {
      _clientId = Configuration["MicrosoftClientId"];
      _clientSecret = Configuration["MicrosoftClientSecret"];

      //var cert = new X509Certificate2( Path.Combine( _environment.ContentRootPath, "jinkserver.snk" ), "" );

      // TODO: Use same DBContext as SimpleCRM.Data (Merge contexts like the "amraps" project)
      services.AddDbContext<ApplicationDbContext>( options => options.UseSqlite( Configuration.GetConnectionString( "LocalConnection" ) ) );

      services.AddIdentity<ApplicationUser, IdentityRole>()
        .AddEntityFrameworkStores<ApplicationDbContext>()
        .AddDefaultTokenProviders();

      services.AddAuthentication()
        .AddMicrosoftAccount( options => {
          options.ClientId = _clientId;
          options.SignInScheme = "Identity.External";
          options.ClientSecret = _clientSecret;
         } );

      services.AddMvc();

      services.AddTransient<IProfileService, IdentityWithAdditionalClaimsProfileService>();

      services.AddTransient<IEmailSender, AuthMessageSender>();

      services.AddIdentityServer( x => { x.IssuerUri = "https://localhost:44321/"; } )
      //services.AddIdentityServer()
        //.AddSigningCredential( cert )
        .AddDeveloperSigningCredential()
        .AddInMemoryIdentityResources( Config.GetIdentityResources() )
        .AddInMemoryApiResources( Config.GetApiResources() )
        .AddInMemoryClients( Config.GetClients() )
        .AddAspNetIdentity<ApplicationUser>()
        .AddProfileService<IdentityWithAdditionalClaimsProfileService>();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory) {
      loggerFactory.AddConsole( Configuration.GetSection( "Logging" ) );
      loggerFactory.AddDebug();

      loggerFactory.AddSerilog();

      if (env.IsDevelopment()) {
        app.UseDeveloperExceptionPage();
        app.UseDatabaseErrorPage();
      }
      else app.UseExceptionHandler( "/Home/Error" );

      app.UseStaticFiles()
        .UseIdentityServer()
        .UseAuthentication()
        .UseMvc( routes => routes.MapRoute( "default", "{controller=Home}/{action=Index}/{id?}" ) );
    }
  }
}

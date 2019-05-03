using System.Reflection;
using IdentityServer4.Services;
using IdentityServer4.Stores;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using SimpleCMS.Auth.Configuration;
using SimpleCMS.Auth.Extensions;
using SimpleCMS.Auth.Services;
using SimpleCMS.Auth.Stores;
using SimpleCMS.Common;
using SimpleCMS.Data;
using SimpleCMS.Data.Entities;
using SimpleCMS.Data.Extensions;

namespace SimpleCMS.Auth {
  public class Startup {

    private IConfigurationRoot Configuration { get; }

    public Startup(IHostingEnvironment env) {
      Log.Logger = new LoggerConfiguration()
        .MinimumLevel.Verbose()
        .Enrich.WithProperty( "App", "SimpleCMS.Auth" )
        .Enrich.FromLogContext()
        .WriteTo.Seq( "http://localhost:5341" )
        .WriteTo.RollingFile( "../Logs/Auth" )
        .CreateLogger();

      var builder = new ConfigurationBuilder()
        .SetBasePath( env.ContentRootPath )
        .AddJsonFile( "appsettings.json", optional: true, reloadOnChange: true )
        .AddJsonFile( $"appsettings.{env.EnvironmentName}.json", optional: true );

      if (env.IsDevelopment()) builder.AddUserSecrets( "AspNetCoreID4External...." );

      builder.AddEnvironmentVariables();
      Configuration = builder.Build();
    }

    // This method gets called by the runtime. Use this method to add services to the container.
    // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
    public void ConfigureServices(IServiceCollection services) {
      var clientId = Configuration["MicrosoftClientId"];
      var clientSecret = Configuration["MicrosoftClientSecret"];

      var connectionString = Configuration.GetConnectionString( "DefaultConnection" );
      var migrationsAssembly = typeof( CmsContext ).GetTypeInfo().Assembly.GetName().Name;

      var certificatePath = Configuration["certificates:signing"];
      var certificatePassword = Configuration["certificates:password"];

      // load identityserver config from file and set into configuration
      services.AddOptions();
      services.Configure<IdentityServerConfiguration>( Configuration.GetSection( "IdentityServerConfiguration" ) );

      // add main database context using SQL Server
      services.AddDbContext<CmsContext>( options => options.UseSqlServer( connectionString ) );

      services.AddIdentity<AppUser, AppRole>()
        .AddEntityFrameworkStores<CmsContext>()
        .AddDefaultTokenProviders();

      services.AddAuthentication()
        .AddMicrosoftAccount( options => {
          options.ClientId = clientId;
          options.SignInScheme = "Identity.External";
          options.ClientSecret = clientSecret;
        } );

      services.AddMvc();

      services.AddTransient<IClientStore, CmsClientsStore>();
      services.AddTransient<IResourceStore, CmsResourceStore>();
      services.AddTransient<IProfileService, CmsProfileService>();
      services.AddTransient<IEmailSender, AuthMessageSender>();
      services.AddSingleton<IMetricsUtil>( MetricsUtil.Singleton );

      services.AddIdentityServer( x => x.IssuerUri = "https://localhost:44321/" )
        .LoadSigningCredentialFrom( certificatePath, certificatePassword )
        .AddConfigurationStore( options => {
          options.ConfigureDbContext = builder =>
            builder.UseSqlServer( connectionString, sql => sql.MigrationsAssembly( migrationsAssembly ) );
          options.DefaultSchema = "auth";
        } )
        .AddOperationalStore( options => {
          options.ConfigureDbContext = builder =>
            builder.UseSqlServer( connectionString, sql => sql.MigrationsAssembly( migrationsAssembly ) );
          options.DefaultSchema = "auth";
        } )
        .AddAspNetIdentity<AppUser>()
        .AddClientStore<CmsClientsStore>()
        .AddProfileService<CmsProfileService>()
        .AddResourceStore<CmsResourceStore>();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env) {

      if (env.IsDevelopment()) {
        app.UseDeveloperExceptionPage();
        app.UseDatabaseErrorPage();
      }
      else app.UseExceptionHandler( "/Home/Error" );

      app.UseXfo( s => s.Deny() );
      app.UseCsp( configurer => configurer.FrameAncestors( config => config.CustomSources( "http://localhost:4200", "https://localhost:44300" ) ) );

      app.UseStaticFiles()
        .UseIdentityServer()
        .UseAuthentication()
        .UseMvc( routes => routes.MapRoute( "default", "{controller=Home}/{action=Index}/{id?}" ) );

      app.InitializeDatabase();
    }
  }
}

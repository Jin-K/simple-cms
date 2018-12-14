using System.Reflection;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using IdentityServer4.Services;
using IdentityServer4.Stores;
using Serilog;
using SimpleCRM.Auth.Services;
using SimpleCRM.Data;
using SimpleCRM.Auth.Stores;
using SimpleCRM.Auth.Configuration;
using SimpleCRM.Data.Entities;
using SimpleCRM.Auth.Extensions;
using SimpleCRM.Common;

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

      _environment = env;

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
      _clientId = Configuration["MicrosoftClientId"];
      _clientSecret = Configuration["MicrosoftClientSecret"];

      var connectionString = Configuration.GetConnectionString("DefaultConnection");
      var migrationsAssembly = typeof(CrmContext).GetTypeInfo().Assembly.GetName().Name;

      // Load identityserver config from file and set into configuration
      services.AddOptions();
      services.Configure<IdentityServerConfiguration>(Configuration.GetSection("IdentityServerConfiguration"));

      // TODO: Use same DBContext as SimpleCRM.Data (Merge contexts like the "amraps" project)
      services.AddDbContext<CrmContext>(options => options.UseSqlServer(connectionString));

      services.AddIdentity<AppUser, AppRole>()
        .AddEntityFrameworkStores<CrmContext>()
        .AddDefaultTokenProviders();

      services.AddAuthentication()
        .AddMicrosoftAccount( options => {
          options.ClientId = _clientId;
          options.SignInScheme = "Identity.External";
          options.ClientSecret = _clientSecret;
         } );

      services.AddMvc();

      services.AddTransient<IClientStore, CrmClientsStore>();
      services.AddTransient<IResourceStore, CrmResourceStore>();
      services.AddTransient<IProfileService, CrmProfileService>();
      services.AddTransient<IEmailSender, AuthMessageSender>();
      services.AddSingleton<IMetricsUtil>(MetricsUtil.Singleton);

      services.AddIdentityServer( x => x.IssuerUri = "https://localhost:44321/" )
        // .AddSigningCredential( cert )
        // .AddDeveloperSigningCredential()
        .LoadSigningCredentialFrom(Configuration["certificates:signing"], Configuration["certificates:password"])
        .AddConfigurationStore(options => {
          options.ConfigureDbContext = builder =>
            builder.UseSqlServer(connectionString, sql => sql.MigrationsAssembly(migrationsAssembly));
          options.DefaultSchema = "auth";
        })
        .AddOperationalStore(options => {
          options.ConfigureDbContext = builder =>
            builder.UseSqlServer(connectionString, sql => sql.MigrationsAssembly(migrationsAssembly));
          options.DefaultSchema = "auth";
        })
        .AddAspNetIdentity<AppUser>()
        .AddClientStore<CrmClientsStore>()
        .AddProfileService<CrmProfileService>()
        .AddResourceStore<CrmResourceStore>();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env) {

      if (env.IsDevelopment()) {
        app.UseDeveloperExceptionPage();
        app.UseDatabaseErrorPage();
      }
      else app.UseExceptionHandler( "/Home/Error" );

      app.UseXfo(s => s.Deny());
      app.UseCsp(configurer => configurer.FrameAncestors(config => config.CustomSources("http://localhost:4200", "https://localhost:44300")));

      app.UseStaticFiles()
        .UseIdentityServer()
        .UseAuthentication()
        .UseMvc( routes => routes.MapRoute( "default", "{controller=Home}/{action=Index}/{id?}" ) );

      app.InitializeDatabase();
    }
  }
}

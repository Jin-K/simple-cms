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
using System.Reflection;
using Microsoft.Extensions.Options;

namespace SimpleCMS.Auth {
	public class Startup {

		private IConfigurationRoot Configuration { get; }

		public Startup(IHostingEnvironment env) {
			var builder = new ConfigurationBuilder()
			  .SetBasePath( env.ContentRootPath )
			  .AddJsonFile( "appsettings.json", optional: true, reloadOnChange: true )
			  .AddJsonFile( $"appsettings.{env.EnvironmentName}.json", optional: true );

			if (env.IsDevelopment()) builder.AddUserSecrets( "AspNetCoreID4External...." );

			builder.AddEnvironmentVariables();
			Configuration = builder.Build();

			// extract serilog post config data from config
			var serilogConfigurationSection = Configuration.GetSection( "Serilog:Configuration" );
			var serilogPropertySection = serilogConfigurationSection.GetSection( "property" );

			Log.Logger = new LoggerConfiguration()
			  .MinimumLevel.Verbose()
			  .Enrich.WithProperty( serilogPropertySection["name"], serilogPropertySection["value"] )
			  .Enrich.FromLogContext()
			  .WriteTo.Seq( serilogConfigurationSection["serverUrl"] )
			  .WriteTo.RollingFile( serilogConfigurationSection["pathFormat"] )
			  .CreateLogger();
		}

		// This method gets called by the runtime. Use this method to add services to the container.
		// For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
		public void ConfigureServices(IServiceCollection services) {
			var clientId = Configuration["MicrosoftClientId"];
			var clientSecret = Configuration["MicrosoftClientSecret"];

			var connectionString = "Host=localhost;Username=gitpod;Database=simple-cms";
			var migrationsAssembly = typeof( CmsContext ).GetTypeInfo().Assembly.GetName().Name;

			// load security configuration
			var identityServerConfigurationSection = Configuration.GetSection("IdentityServerConfiguration");
			var identityServerConfiguration = identityServerConfigurationSection.Get<IdentityServerConfiguration>();

			// create identityserver config options singleton for DI
			services.AddOptions();
			services.Configure<IdentityServerConfiguration>( identityServerConfigurationSection );

			// add main database context using SQL Server
			services.AddDbContext<CmsContext>(options => options.UseNpgsql(connectionString));

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

			services.AddIdentityServer( x => x.IssuerUri = identityServerConfiguration.IssuerUri )
			  .AddSigningCredential()
			  .AddConfigurationStore( options => {
				  options.ConfigureDbContext = builder => builder.UseNpgsql( connectionString, sql => sql.MigrationsAssembly( migrationsAssembly ) );
				  options.DefaultSchema = "auth";
			  } )
			  .AddOperationalStore( options => {
				  options.ConfigureDbContext = builder => builder.UseNpgsql( connectionString, sql => sql.MigrationsAssembly( migrationsAssembly ) );
				  options.DefaultSchema = "auth";
			  } )
			  .AddAspNetIdentity<AppUser>()
			  .AddClientStore<CmsClientsStore>()
			  .AddProfileService<CmsProfileService>()
			  .AddResourceStore<CmsResourceStore>();
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env, IOptions<IdentityServerConfiguration> identityServerConfigurationOptions) {

			if (env.IsDevelopment()) {
				app.UseDeveloperExceptionPage();
				app.UseDatabaseErrorPage();
			}
			else app.UseExceptionHandler( "/Home/Error" );

			app.UseXfo( s => s.Deny() );
			app.UseCsp( configurator => configurator.FrameAncestors( config => config.CustomSources( identityServerConfigurationOptions.Value.CustomSources ) ) );

			app.UseStaticFiles()
			  .UseIdentityServer()
			  .UseAuthentication()
			  .UseMvc( routes => routes.MapRoute( "default", "{controller=Home}/{action=Index}/{id?}" ) );
		}
	}
}

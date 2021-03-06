using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Primitives;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Serialization;
using Serilog;
using SimpleCMS.Api.Hubs;
using SimpleCMS.Business.Providers;
using SimpleCMS.Common;
using SimpleCMS.Common.Extensions;
using SimpleCMS.Data;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Threading.Tasks;
using SimpleCMS.Api.Extensions;
using SimpleCMS.Business.Services;

namespace SimpleCMS.Api {

	/// <summary>
	/// The main Startup class of SimpleCMS.Api
	/// This method gets called by the runtime. Use this method to add services to the container
	/// For more information on how to configure your application, visit <see href="https://go.microsoft.com/fwlink/?LinkID=398940" />
	/// </summary>
	public class Startup {

		/// <summary>
		/// Configuration object.
		/// Instantiated in <see cref="Startup" />
		/// </summary>
		private readonly IConfigurationRoot _configuration;

		/// <summary>
		/// The main constructor.
		/// </summary>
		/// <param name="env">Injected hosting environment object. <seealso cref="IHostingEnvironment" /></param>
		public Startup(IHostingEnvironment env) {

			// build configuration
			var builder = new ConfigurationBuilder()
				.SetBasePath( env.ContentRootPath )
				.AddJsonFile( "appsettings.json" );

			// store configuration object
			_configuration = builder.Build();

			// extract serilog post config data from config
			var serilogConfigurationSection = _configuration.GetSection( "Serilog:Configuration" );
			var serilogPropertySection = serilogConfigurationSection.GetSection( "property" );

			// logger setup
			Log.Logger = new LoggerConfiguration()
				.MinimumLevel.Verbose()
				.Enrich.WithProperty( serilogPropertySection["name"], serilogPropertySection["value"] )
				.Enrich.FromLogContext()
				.WriteTo.Seq( serilogConfigurationSection["serverUrl"] )
				.WriteTo.RollingFile( serilogConfigurationSection["pathFormat"] )
				.CreateLogger();

			// TODELETE reset static fake db
			Controllers.ChatController.FakeDb = null;
		}

		/// <summary>
		/// The main ConfigureServices method of <see cref="Startup" />
		/// </summary>
		/// <param name="services">Received collection on which we should attach our own services.</param>
		public void ConfigureServices(IServiceCollection services) {

			// get connection string
			var defaultConnection = _configuration.GetConnectionString( "DefaultConnection" );

			// add main database context using SQL Server
			services.AddDbContext<CmsContext>( options => options.UseSqlServer( defaultConnection ), ServiceLifetime.Scoped );

			// add singletons of store services for DI
			services.AddScoped<NewsStore>();
			services.AddScoped<IMainStore, MainStore>();
			services.AddScoped<IElementsStore, ElementsStore>();
			services.AddScoped<IMiscStore, MiscStore>();
			services.AddScoped<UsersStore>();
			services.AddScoped<WidgetsStore>();
			services.AddSingleton<IMetricsUtil>( MetricsUtil.Singleton );

			// add business services
			services.AddScoped<IEntityService, EntityService>();

			// add AutoMapper extension
			services.AddAutoMapperSetup();

			// create custom cors policy
			var policy = new Microsoft.AspNetCore.Cors.Infrastructure.CorsPolicy();
			policy.Headers.Add( "*" );
			policy.Methods.Add( "*" );
			policy.Origins.Add( "*" );
			policy.SupportsCredentials = true;
			policy.ExposedHeaders.Add( "X-Pagination" );

			// add custom policy to cors options using "corsGlobalPolicy" as name
			services.AddCors( options => options.AddPolicy( "corsGlobalPolicy", policy ) );

			// get authentication section from config
			var authenticationSection = _configuration.GetSection( "Authentication" );

			// create token validation parameters
			var tokenValidationParameters = new TokenValidationParameters {
				ValidIssuer = authenticationSection["tokenValidIssuer"],
				ValidAudience = "dataEventRecords",
				IssuerSigningKey = new SymmetricSecurityKey( Encoding.UTF8.GetBytes( "dataEventRecordsSecret" ) ),
				NameClaimType = "name",
				RoleClaimType = "role"
			};

			// get authentication.authorities section from config
			var authoritiesSection = authenticationSection.GetSection( "authorities" );

			// add the authentication scheme and setup the bearer authentication handler
			services.AddAuthentication( IdentityServerAuthenticationDefaults.AuthenticationScheme )
				.AddJwtBearer( options => {

					// if running in docker container, set the authority server endpoint to authoritiesSection["Docker"] and disable https requirement
					if (System.Environment.GetEnvironmentVariable( "DOTNET_RUNNING_IN_CONTAINER" ) == "true") {
						options.Authority = authoritiesSection["Docker"];
						options.RequireHttpsMetadata = false;
					}
					// if running in linux, set the authority server endpoint to authoritiesSection["Linux"] and disable https requirement
					else if (System.Environment.GetEnvironmentVariable( "DOTNET_RUNNING_IN_LINUX" ) == "true") {
						options.Authority = authoritiesSection["Linux"];
						options.RequireHttpsMetadata = false;
					}
					// if running in windows, set the authority server endpoint to authoritiesSection["Windows"];
					else {
						options.Authority = authoritiesSection["Windows"];
					}

					// configure OpenID, JWT, tokens, etc (no idea what these options mean)
					options.Audience = "dataEventRecords";
					options.IncludeErrorDetails = true;
					options.SaveToken = true;
					options.SecurityTokenValidators.Clear();
					options.SecurityTokenValidators.Add( new JwtSecurityTokenHandler { InboundClaimTypeMap = new Dictionary<string, string>() } );
					options.TokenValidationParameters = tokenValidationParameters;

					// configure (assign delegates) events raised by the bearer authentication handler
					options.Events = new JwtBearerEvents {

						// on message received
						OnMessageReceived = context => {

							// for SignalR routes (auth required), extract token from url and give it to (MessageReceivedContext) context
							if (context.Request.Path.Value.StartsWithOneOf( "/signalrhome", "/looney" ) && context.Request.Query.TryGetValue( "token", out StringValues token ))
								context.Token = token;

							// return
							return Task.CompletedTask;
						},

						// on authentication exception (TODO do I need this ? check https://github.com/aspnet/Security/issues/1837)
						OnAuthenticationFailed = context => {

							// suppress exception (no re-thrown)
							var te = context.Exception;

							// return
							return Task.CompletedTask;
						}

					};
				}
			);

			// add authorization
			services.AddAuthorization();

			// add SignalR
			services.AddSignalR();

			// add MVC and setup json options
			services.AddMvc().AddJsonOptions( options => {

				// camel case in json responses
				options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

				// ignore self-referencing loops (resolves this type of console error: "Newtonsoft.Json.JsonSerializationException: Self referencing loop detected for property 'contact' with type 'SimpleCMS.Data.Entities.Contact'. Path 'addresses[0]'.")
				options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
			} );

		}

		/// <summary>
		/// The main Configure method of <see cref="Startup" />
		/// </summary>
		/// <remarks>
		/// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		/// </remarks>
		/// <param name="app"></param>
		/// <param name="env"></param>
		public void Configure(IApplicationBuilder app, IHostingEnvironment env) {

			// set exception's route
			app.UseExceptionHandler( "/Home/Error" );

			// use "corsGlobalPolicy" name (defined above) as cors policy
			app.UseCors( "corsGlobalPolicy" );

			// use authentication
			app.UseAuthentication();

			// use https redirection (if we try to connect to http route)
			app.UseHttpsRedirection();

			// define route that SignalR should use
			app.UseSignalR( routes => {
				routes.MapHub<SignalRHomeHub>( "/signalrhome" );
				routes.MapHub<NewsHub>( "/looney" );
				routes.MapHub<DashboardHub>( "/dashboard" );
			} );

			// define MVC's route map strategy
			app.UseMvc( routes => {

				// default routes
				routes.MapRoute(
				  name: "default",
				  template: "{controller=Home}/{action=Index}/{id?}"
				);

			} );
		}

	}

}

using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Primitives;
using Microsoft.IdentityModel.Tokens;

using Newtonsoft.Json.Serialization;
using IdentityServer4.AccessTokenValidation;
using Serilog;

using SimpleCRM.Api.Hubs;
using SimpleCRM.Business.Providers;
using SimpleCRM.Data;
using SimpleCRM.Common;

namespace SimpleCRM.Api {

	/// <summary>
	/// The main Startup class of SimpleCRM.Api
	/// This method gets called by the runtime. Use this method to add services to the container
	/// For more information on how to configure your application, visit <see href="https://go.microsoft.com/fwlink/?LinkID=398940" />
	/// </summary>
	public class Startup {

    /// <summary>
    /// Configuration object.
    /// Instanciated in <see cref="Startup.Startup(IHostingEnvironment)" />
    /// </summary>
    readonly IConfigurationRoot _configuration;

    /// <summary>
    /// Hosting environment object.
    /// Instanciated in <see cref="Startup.Startup(IHostingEnvironment)" />
    /// </summary>
    readonly IHostingEnvironment _env;

    /// <summary>
    /// The main constructor.
    /// </summary>
    /// <param name="env">Injected hosting environment object. <seealso cref="IHostingEnvironment" /></param>
    public Startup(IHostingEnvironment env) {

      // logger setup
      Log.Logger = new LoggerConfiguration()
        .MinimumLevel.Verbose()
        .Enrich.WithProperty("App", "SimpleCRM.Api")
        .Enrich.FromLogContext()
        .WriteTo.Seq("http://localhost:5341")
        .WriteTo.RollingFile("../Logs/Api")
        .CreateLogger();

      // store environment object
      this._env = env;

      // build configuration
      var builder = new ConfigurationBuilder()
        .SetBasePath(env.ContentRootPath)
        .AddJsonFile("appsettings.json");

      // store configuration object
      _configuration = builder.Build();
    }

    /// <summary>
    /// The main ConfigureServices method of <see cref="Startup" />
    /// </summary>
    /// <param name="services">Received collection on which we should attach our own services.</param>
    public void ConfigureServices(IServiceCollection services) {

      // get connection string
      var defaultConnection = _configuration.GetConnectionString("DefaultConnection");

      // add main database context using SQL Server
      services.AddDbContext<CrmContext>( options => options.UseSqlServer( defaultConnection ), ServiceLifetime.Singleton );

      // add singletons of store services for DI
      services.AddSingleton<NewsStore>();
      services.AddSingleton<EntitiesStore>();
      services.AddSingleton<WidgetsStore>();
      //services.AddSingleton<UserInfoInMemory>(); // TODO Check if required
      services.AddSingleton<IMetricsUtil>(MetricsUtil.Singleton);

      // create custom cors policy
      var policy = new Microsoft.AspNetCore.Cors.Infrastructure.CorsPolicy();
      policy.Headers.Add("*");
      policy.Methods.Add("*");
      policy.Origins.Add("*");
      policy.SupportsCredentials = true;
      policy.ExposedHeaders.Add( "X-Pagination" );

      // add custom policy to cors options using "corsGlobalPolicy" as name
      services.AddCors(options => options.AddPolicy("corsGlobalPolicy", policy));

      // create custom authorization policy
      var guestPolicy = new AuthorizationPolicyBuilder()
        .RequireClaim("scope", "dataEventRecords")
        .Build();

      // create token validation parameters
      var tokenValidationParameters = new TokenValidationParameters {
        ValidIssuer = "https://localhost:44321/",
        ValidAudience = "dataEventRecords",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("dataEventRecordsSecret")),
        NameClaimType = "name",
        RoleClaimType = "role"
      };

      // add the authentication scheme and setup the bearer authentication handler
      services.AddAuthentication(IdentityServerAuthenticationDefaults.AuthenticationScheme)
        .AddJwtBearer(options => {

          // if running in docker container, set the authority server endpoint to http://auth:50772 and disable https requirement
          if (System.Environment.GetEnvironmentVariable( "DOTNET_RUNNING_IN_CONTAINER" ) == "true") {
            options.Authority = "http://auth:50772/";
            options.RequireHttpsMetadata = false;
          }
          // if running in linux, set the authority server endpoint to http://localhost:50772 and disable https requirement
          else if (System.Environment.GetEnvironmentVariable( "DOTNET_RUNNING_IN_LINUX" ) == "true") {
            options.Authority = "http://localhost:50772/";
            options.RequireHttpsMetadata = false;
          }
          // if running in windows, set the authority server endpoint to https://localhost:44321
          else {
            options.Authority = "https://localhost:44321/";
          }

          // configure OpenID, JWT, tokens, etc (no idea what these options mean)
          options.Audience = "dataEventRecords";
          options.IncludeErrorDetails = true;
          options.SaveToken = true;
          options.SecurityTokenValidators.Clear();
          options.SecurityTokenValidators.Add(new JwtSecurityTokenHandler { InboundClaimTypeMap = new Dictionary<string, string>() });
          options.TokenValidationParameters = tokenValidationParameters;

          // configure (assign delegates) events raised by the bearer authentication handler
          options.Events = new JwtBearerEvents {
            
            // on message received
            OnMessageReceived = context => {

              // for SignalR routes, extract token from url and give it to (MessageReceivedContext) context
              if (context.Request.Path.Value.StartsWithOneOf("/signalrhome", "/message", "/looney") && context.Request.Query.TryGetValue("token", out StringValues token) )
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
        });

      // add authorization
      services.AddAuthorization();

      // add SignalR
      services.AddSignalR();

      // add MVC and setup json options
      services.AddMvc().AddJsonOptions(options => {

        // camel case in json responses
        options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

        // ignore self-referencing loops (resolves this type of console error: "Newtonsoft.Json.JsonSerializationException: Self referencing loop detected for property 'contact' with type 'SimpleCRM.Data.Entities.Contact'. Path 'addresses[0]'.")
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
      });

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
      app.UseExceptionHandler("/Home/Error");

      // use "corsGlobalPolicy" name (defined above) as cors policy
      app.UseCors("corsGlobalPolicy");

      // use authentication
      app.UseAuthentication();

      // use https redirection (if we try to connect to http route)
      app.UseHttpsRedirection();

      // define route that SignalR should use
      app.UseSignalR( routes => {
        routes.MapHub<SignalRHomeHub>( "/signalrhome" );
        routes.MapHub<MessageHub>( "/message" );
        routes.MapHub<NewsHub>("/looney");
        routes.MapHub<DashboardHub>( "/dashboard" );
      });

      // define MVC's route map strategy
      app.UseMvc(routes => {

        // default routes
        routes.MapRoute(
          name: "default",
          template: "{controller=Home}/{action=Index}/{id?}"
        );

      });
    }

  }

}

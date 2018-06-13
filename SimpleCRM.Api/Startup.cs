using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Serialization;
using Serilog;
using SimpleCRM.Api.Data;
using SimpleCRM.Api.Hubs;
using SimpleCRM.Api.Providers;
using SimpleCRM.Api.Repositories;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Threading.Tasks;

namespace SimpleCRM.Api {
  public class Startup {
    // This method gets called by the runtime. Use this method to add services to the container.
    // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940

    public IConfigurationRoot Configuration { get; }
    IHostingEnvironment env { get; }

    public Startup(IHostingEnvironment env) {
      Log.Logger = new LoggerConfiguration()
        .MinimumLevel.Verbose()
        .Enrich.WithProperty("App", "SimpleCRM.Api")
        .Enrich.FromLogContext()
        .WriteTo.Seq("http://localhost:5341")
        .WriteTo.RollingFile("../Logs/Api")
        .CreateLogger();

      this.env = env;
      var builder = new ConfigurationBuilder()
        .SetBasePath(env.ContentRootPath)
        .AddJsonFile("appsettings.json");

      Configuration = builder.Build();
    }

    public void ConfigureServices(IServiceCollection services) {
      var sqliteConnectionString = Configuration.GetConnectionString("SqliteConnectionString");
      var defaultConnection = Configuration.GetConnectionString("DefaultConnection");

      services.AddDbContext<DataEventRecordContext>(options => options.UseSqlite(sqliteConnectionString));
      
      services.AddDbContext<NewsContext>( options => options.UseSqlite( defaultConnection ), ServiceLifetime.Singleton );

      services.AddSingleton<NewsStore>();
      //services.AddSingleton<UserInfoInMemory>();

      var policy = new Microsoft.AspNetCore.Cors.Infrastructure.CorsPolicy();
      policy.Headers.Add("*");
      policy.Methods.Add("*");
      policy.Origins.Add("*");
      policy.SupportsCredentials = true;

      services.AddCors(options => options.AddPolicy("corsGlobalPolicy", policy));

      var guestPolicy = new AuthorizationPolicyBuilder()
        .RequireClaim("scope", "dataEventRecords")
        .Build();

      var tokenValidationParameters = new TokenValidationParameters {
        ValidIssuer = "https://localhost:44321/",
        ValidAudience = "dataEventRecords",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("dataEventRecordsSecret")),
        NameClaimType = "name",
        RoleClaimType = "role"
      };

      var jwtSecurityTokenHandler = new JwtSecurityTokenHandler { InboundClaimTypeMap = new Dictionary<string, string>() };

      services.AddAuthentication(IdentityServerAuthenticationDefaults.AuthenticationScheme)
        .AddJwtBearer(options => {
          options.Authority = "https://localhost:44321/";
          options.Audience = "dataEventRecords";
          options.IncludeErrorDetails = true;
          options.SaveToken = true;
          options.SecurityTokenValidators.Clear();
          options.SecurityTokenValidators.Add(jwtSecurityTokenHandler);
          options.TokenValidationParameters = tokenValidationParameters;
          options.Events = new JwtBearerEvents {
            OnMessageReceived = context => {
              if (
                (
                  context.Request.Path.Value.StartsWith("/message")
                  || context.Request.Path.Value.StartsWith("/looney")
                )
                && context.Request.Query.TryGetValue("token", out StringValues token)
              ) context.Token = token;

              return Task.CompletedTask;
            },
            OnAuthenticationFailed = context => {
              var te = context.Exception;
              return Task.CompletedTask;
            }
          };
        });

      services.AddAuthorization(options => { });

      //services.AddCors( 
      //  options => options.AddPolicy( 
      //    "AllowAny", 
      //    x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader().AllowCredentials() 
      //  )
      //);
      services.AddSignalR();
      //services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
      services.AddMvc(options => { }).AddJsonOptions(options =>
        options.SerializerSettings.ContractResolver = new DefaultContractResolver()
      );

      services.AddTransient<IDataEventRecordRepository, DataEventRecordRepository>();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory) {

      loggerFactory.AddConsole();
      loggerFactory.AddDebug();

      loggerFactory.AddSerilog();

      app.UseExceptionHandler("/Home/Error");
      app.UseCors("corsGlobalPolicy");

      app.UseAuthentication();

      app.UseSignalR( routes => {
        routes.MapHub<MessageHub>( "/message" );
        routes.MapHub<NewsHub>("/looney");
      });

      app.UseMvc(routes => {
        routes.MapRoute(
          name: "default",
          template: "{controller=Home}/{action=Index}/{id?}"
        );
      });
    }
  }
}

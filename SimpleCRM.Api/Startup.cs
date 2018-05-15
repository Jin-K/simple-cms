using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using SimpleCRM.Api.Hubs;
using SimpleCRM.Api.Providers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;

namespace SimpleCRM.Api {
  public class Startup {
    // This method gets called by the runtime. Use this method to add services to the container.
    // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940

    // public IConfigurationRoot Configuration { get; }
    
    public void ConfigureServices(IServiceCollection services) {
      var connectionString = "Data Source=C:\\data\\repos\\AspNetCoreAngularSignalR\\src\\AspNetCoreAngularSignalR\\news.sqlite";
      services.AddDbContext<NewsContext>( options => options.UseSqlite( connectionString ), ServiceLifetime.Singleton );
      services.AddCors( 
        options => options.AddPolicy( 
          "AllowAny", 
          x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader().AllowCredentials() 
        )
      );
      services.AddSingleton<NewsStore>();
      services.AddSignalR();
      services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env) {
      app.UseHsts();
      app.UseCors("AllowAny");
      // app.UseHttpsRedirection();
      app.UseSignalR( routes => {
        routes.MapHub<MessageHub>( "/message" );
        routes.MapHub<NewsHub>("/looney");
      });
      app.UseMvc();
    }
  }
}

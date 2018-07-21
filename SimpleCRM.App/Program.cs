using System.Net;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace SimpleCRM.App {
  public class Program {
    public static void Main(string[] args)
      => CreateWebHostBuilder( args ).Build().Run();
    public static IWebHostBuilder CreateWebHostBuilder(string[] args)
      => WebHost.CreateDefaultBuilder( args )
                .UseKestrel(
                  options => options.Listen( IPAddress.Any, 44300, listenOptions => {
                    var configuration = (IConfiguration) options.ApplicationServices.GetService( typeof( IConfiguration ) );
                    listenOptions.UseHttps( "cert.pfx", configuration[ "certPassword" ] );
                  } )
                )
                .UseStartup<Startup>();
  }
}

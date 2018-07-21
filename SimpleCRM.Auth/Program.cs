using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace SimpleCRM.Auth {
  public class Program {
    public static void Main(string[] args)
      => CreateWebHostBuilder( args ).Build().Run();
    public static IWebHostBuilder CreateWebHostBuilder(string[] args)
      => WebHost.CreateDefaultBuilder( args )
                .UseKestrel(
                  options => options.Listen( System.Net.IPAddress.Any, 44321, listenOptions => {
                    var configuration = (IConfiguration) options.ApplicationServices.GetService( typeof( IConfiguration ) );
                    listenOptions.UseHttps( "cert.pfx", configuration[ "certPassword" ] );
                  })
                )
                .UseStartup<Startup>();
    }
}

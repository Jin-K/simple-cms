using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using SimpleCRM.Common.Extensions;

namespace SimpleCRM.Auth {
	public class Program {
    public static void Main(string[] args)
      => CreateWebHostBuilder( args ).Build().Run();
    public static IWebHostBuilder CreateWebHostBuilder(string[] args)
      => WebHost.CreateDefaultBuilder( args )
                .Listen4Certificates()
                .UseStartup<Startup>();
    }
}

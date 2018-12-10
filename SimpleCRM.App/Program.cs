using System.IO;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using SimpleCRM.Common.Extensions;

namespace SimpleCRM.App {
  public class Program {
    public static void Main(string[] args)
      => CreateWebHostBuilder( args ).Build().Run();
    public static IWebHostBuilder CreateWebHostBuilder(string[] args)
      => WebHost.CreateDefaultBuilder( args )
          .ConfigSerilog(BuildConfig().GetSection("Logging"))
          .UseStartup<Startup>();

    static IConfigurationRoot BuildConfig() 
      => new ConfigurationBuilder()
          .SetBasePath(Directory.GetCurrentDirectory())
          .AddJsonFile("appsettings.json")
          .Build();
  }
}

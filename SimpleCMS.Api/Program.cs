using System.IO;
using System.Runtime.InteropServices;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using SimpleCMS.Common.Extensions;

namespace SimpleCMS.Api {
  public class Program {
    public static void Main(string[] args)
    => CreateWebHostBuilder( args ).Build().Run();

    public static IWebHostBuilder CreateWebHostBuilder(string[] args) {
      var builder = WebHost.CreateDefaultBuilder( args );
      if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux)) builder = builder.Listen4Certificates();
      return builder
	      .ConfigSerilog( BuildConfig().GetSection( "Serilog:Logging" ) )
	      .UseStartup<Startup>();
    }

    static IConfigurationRoot BuildConfig()
    => new ConfigurationBuilder()
        .SetBasePath( Directory.GetCurrentDirectory() )
        .AddJsonFile( "appsettings.json" )
        .Build();
  }
}

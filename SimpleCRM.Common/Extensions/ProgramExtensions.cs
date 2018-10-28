using System;
using System.Net;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace SimpleCRM.Common.Extensions {
	public static class ProgramExtensions {
    public static IWebHostBuilder Listen4Certificates(this IWebHostBuilder builder) => builder.UseKestrel(
      options => {
        // Configure the Url and ports to bind to
        // This overrides call to UseUrls and the ASPNETCORE_URLS environment variable, but will be
        // overriden if you call UseIisIntegration() and host behind IIS/IIS Express
        var configuration = options.ApplicationServices.GetService<IConfiguration>();
        var urls = configuration["ASPNETCORE_URLS"].Split(';', System.StringSplitOptions.RemoveEmptyEntries);
        foreach(var url in urls) {
          var portPosition = url.Length > 6 ? 6 + url.Substring(6).LastIndexOf(':') : -1;
          var port = portPosition == -1 ? 80 : int.Parse( url.Substring(portPosition + 1) );
          // int port = int.TryParse(url.Split(':', StringSplitOptions.RemoveEmptyEntries).Last(), out test) ? test : 80;
          if (url.StartsWith("http://")) {
            options.Listen(IPAddress.Loopback, port);
          }
          else if (url.StartsWith("https://")) {
            options.Listen(IPAddress.Loopback, port, listenOptions => listenOptions.UseHttps(configuration["certificates:signing"], configuration["certificates:password"]));
          }
        }
      }
    );
	}
}

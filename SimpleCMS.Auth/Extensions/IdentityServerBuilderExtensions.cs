using System.Security.Cryptography.X509Certificates;
using Microsoft.Extensions.DependencyInjection;

namespace SimpleCMS.Auth.Extensions {
  public static class IdentityServerBuilderExtensions {
    public static IIdentityServerBuilder AddSigningCredential(this IIdentityServerBuilder builder, string path = null, string password = null) {
      if (!string.IsNullOrEmpty(path))
        builder.AddSigningCredential(password == null ? new X509Certificate2(path) : new X509Certificate2(path, password));
      else
        builder.AddDeveloperSigningCredential();
      
      return builder;
    }
  }
}

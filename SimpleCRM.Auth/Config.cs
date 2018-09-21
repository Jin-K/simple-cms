using IdentityServer4.Models;
using System.Collections.Generic;

namespace SimpleCRM.Auth {
  public class Config {

    public static IEnumerable<IdentityResource> GetIdentityResources() =>
      new List<IdentityResource> {
        new IdentityResources.OpenId(),
        new IdentityResources.Profile(),
        new IdentityResources.Email(),
        new IdentityResource("dataeventrecordsscope", new[] { "role", "admin", "user", "dataEventRecords", "dataEventRecords.admin", "dataEventRecords.user" } ),
        new IdentityResource("securedfilesscope", new[] { "role", "admin", "user", "securedFiles", "securedFiles.admin", "securedFiles.user" } )
      };

    public static IEnumerable<ApiResource> GetApiResources() =>
      new List<ApiResource> {
        new ApiResource("dataEventRecords") {
          ApiSecrets = { new Secret( "dataEventRecordsSecret".Sha256() ) },
          Scopes = { new Scope {
            Name = "dataeventrecords",
            DisplayName = "Scope for the dataEventRecords ApiResource"
          } },
          UserClaims = { "role", "admin", "user", "dataEventRecords", "dataEventRecords.admin", "dataEventRecords.user" }
        }
      };

    public static IEnumerable<Client> GetClients() =>
      new List<Client> {
        new Client {
          ClientName = "angularclient",
          ClientId = "angularclient",
          AccessTokenType = AccessTokenType.Jwt,
          AccessTokenLifetime = 3300, // 330 seconds, default 60 minutes
          IdentityTokenLifetime = 3000,
          AllowedGrantTypes = GrantTypes.Implicit,
          AllowAccessTokensViaBrowser = true,
          AllowOfflineAccess = true,
          AlwaysIncludeUserClaimsInIdToken = true,
          RedirectUris = new List<string> {
            "http://localhost:4200",
            "https://localhost:44300",
          },
          PostLogoutRedirectUris = new List<string> {
            "http://localhost:4200/unauthorized",
            "https://localhost:44300/unauthorized",
            "http://localhost:4200",
            "https://localhost:44300",
          },
          AllowedCorsOrigins = new List<string> {
            "http://localhost:4200",
            "https://localhost:44300",
          },
          AllowedScopes = new List<string> {
            "openid",
            "dataEventRecords",
            "dataeventrecordsscope",
            "role",
            "profile",
            "email"
          }
        }
      };
  }

}

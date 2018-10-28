using System.Collections.Generic;
using System.Threading.Tasks;
using IdentityServer4.EntityFramework.Interfaces;
using IdentityServer4.EntityFramework.Mappers;
using IdentityServer4.EntityFramework.Stores;
using IdentityServer4.Models;
using IdentityServer4.Stores;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SimpleCRM.Auth.Configuration;

namespace SimpleCRM.Auth.Stores {
	public class CrmClientsStore : IClientStore {

    const string PortalClient = "simple-crm";

    readonly IConfigurationDbContext _context;
    readonly IdentityServerConfiguration _identityConfig;
    readonly IClientStore _baseClientStore;

    public CrmClientsStore(
      IConfigurationDbContext context,
      IOptions<IdentityServerConfiguration> configOptions,
      ILogger<ClientStore> logger
    ) {
      _context = context;
      _identityConfig = configOptions.Value;
      _baseClientStore = new ClientStore(context, logger);
    }

		public async Task<Client> FindClientByIdAsync(string clientId) {
      var client = await _baseClientStore.FindClientByIdAsync(clientId);
      if (client != null) return client;

      // Make sure we have the necessary clients in the db.
      if (clientId == PortalClient) return await EnsurePortalClient();

      //******Do other work here to load a client dynamically. 
      // Say for access to developer apis.
      return null;
		}

    #region Statis Clients
    private async Task<Client> EnsurePortalClient() {
      var newClient = new Client {
        ClientName = PortalClient,
        ClientId = PortalClient,
        AccessTokenType = AccessTokenType.Jwt,
        AccessTokenLifetime = 3600, // 3600 seconds, default 60 minutes
        IdentityTokenLifetime = 3000,
        AllowedGrantTypes = GrantTypes.Implicit,
        AllowAccessTokensViaBrowser = true,
        AllowOfflineAccess = true,
        AlwaysIncludeUserClaimsInIdToken = true,
        RedirectUris = _identityConfig.RedirectUris,
        PostLogoutRedirectUris = _identityConfig.RedirectUris,
        AllowedCorsOrigins = _identityConfig.AllowedCorsOrigins,
        AllowedScopes = new List<string> {
          "openid",
          "dataEventRecords",
          "dataeventrecordsscope",
          "role",
          "profile",
          "email"
        }
      };
      _context.Clients.Add(newClient.ToEntity());
      await _context.SaveChangesAsync();
      return newClient;
    }
    #endregion
	}
}

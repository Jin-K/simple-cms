using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IdentityServer4.EntityFramework.Interfaces;
using IdentityServer4.EntityFramework.Mappers;
using IdentityServer4.EntityFramework.Stores;
using IdentityServer4.Models;
using IdentityServer4.Stores;
using Microsoft.Extensions.Logging;

namespace SimpleCRM.Auth.Stores {
  public class CrmResourceStore : IResourceStore {
    readonly IConfigurationDbContext _context;
    readonly IResourceStore _baseResourceStore;

    public CrmResourceStore(IConfigurationDbContext context, ILogger<ResourceStore> logger) {
      _context = context;
      _baseResourceStore = new ResourceStore(context, logger);
    }

		public async Task<IEnumerable<IdentityResource>> FindIdentityResourcesByScopeAsync(IEnumerable<string> scopeNames) {
      var resources = await _baseResourceStore.FindIdentityResourcesByScopeAsync(scopeNames);
      return await SeedIdentityResources(resources.ToList());
    }

		public async Task<IEnumerable<ApiResource>> FindApiResourcesByScopeAsync(IEnumerable<string> scopeNames) {
			var resources = await _baseResourceStore.FindApiResourcesByScopeAsync(scopeNames);
      return await SeedApiResources(resources.ToList());
		}

		public async Task<ApiResource> FindApiResourceAsync(string name) {
      return await _baseResourceStore.FindApiResourceAsync(name);
		}

		public async Task<Resources> GetAllResourcesAsync() {
      var dbResources = await _baseResourceStore.GetAllResourcesAsync();
      dbResources.IdentityResources = await SeedIdentityResources(dbResources.IdentityResources.ToList());
      dbResources.ApiResources = await SeedApiResources(dbResources.ApiResources.ToList());
      return dbResources;
		}

		async Task<ICollection<IdentityResource>> SeedIdentityResources(List<IdentityResource> resources) {
      var seed = new List<IdentityResource> {
        new IdentityResources.OpenId(),
        new IdentityResources.Profile(),
        new IdentityResources.Email(),
        new IdentityResource("dataeventrecordsscope", new[] { "role", "admin", "user", "dataEventRecords", "dataEventRecords.admin", "dataEventRecords.user" } ),
        new IdentityResource("securedfilesscope", new[] { "role", "admin", "user", "securedFiles", "securedFiles.admin", "securedFiles.user" } )
      };

      var save = false;
      foreach(var IdentityResource in seed) {
        if (resources.Exists(i => i.Name.Equals(IdentityResource.Name, StringComparison.CurrentCultureIgnoreCase)))
          continue;
        if (_context.IdentityResources.Any(r => r.Name.Equals(IdentityResource.Name, StringComparison.CurrentCultureIgnoreCase)))
          continue;

        save = true;
        _context.IdentityResources.Add(IdentityResource.ToEntity());
        resources.Add(IdentityResource);
      }
      if (save) await _context.SaveChangesAsync();

      return resources;
    }

    async Task<ICollection<ApiResource>> SeedApiResources(List<ApiResource> resources) {
      var seed = new List<ApiResource> {
        new ApiResource("dataEventRecords", "Scope for the dataEventRecords ApiResource", new List<string>{
          "role",
          "admin",
          "user",
          "dataEventRecords",
          "dataEventRecords.admin",
          "dataEventRecords.user"
        }) { ApiSecrets = { new Secret( "dataEventRecordsSecret".Sha256() ) } }
      };

      var save = false;
      foreach(var apiResource in seed) {
        if (resources.Exists(i => i.Name.Equals(apiResource.Name, StringComparison.CurrentCultureIgnoreCase)))
          continue;
        if (_context.ApiResources.Any(i => i.Name.Equals(apiResource.Name, StringComparison.CurrentCultureIgnoreCase)))
          continue;

        save = true;
        _context.ApiResources.Add(apiResource.ToEntity());
        resources.Add(apiResource);
      }
      if (save) await _context.SaveChangesAsync();

      return resources;
    }
  }
}

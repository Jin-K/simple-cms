using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Entities;
using IdentityServer4.EntityFramework.Options;
using Microsoft.EntityFrameworkCore;
using System;

namespace SimpleCMS.Data {

	/// <summary>DbContext for the IdentityServer configuration data.</summary>
	/// <seealso cref="T:Microsoft.EntityFrameworkCore.DbContext" />
	/// <seealso cref="T:IdentityServer4.EntityFramework.Interfaces.IConfigurationDbContext" />
	public class CustomConfigurationDbContext : ConfigurationDbContext {

		/// <summary>
		/// Initializes a new instance of the <see cref="CustomConfigurationDbContext" /> class.
		/// </summary>
		/// <param name="options">The options to be used by a <see cref="T:Microsoft.EntityFrameworkCore.DbContext" />.</param>
		/// <param name="storeOptions">The store options</param>
		public CustomConfigurationDbContext(DbContextOptions<ConfigurationDbContext> options, ConfigurationStoreOptions storeOptions) : base( options, storeOptions ) { }

		/// <summary>
		/// Configures database tables.
		/// </summary>
		/// <param name="modelBuilder">The builder being used to construct the model for this context. Databases (and other extensions) typically
		/// define extension methods on this object that allow you to configure aspects of the model that are specific
		/// to a given database.</param>
		protected override void OnModelCreating(ModelBuilder modelBuilder) {
			SeedIdentityServerConfiguration( modelBuilder );

			base.OnModelCreating( modelBuilder );
		}

		/// <summary>
		/// Ensures all entities specific to the main <see cref="ConfigurationDbContext"/> have some values.
		/// </summary>
		/// <remarks>Look the method implementation to know what data is seeded.</remarks>
		/// <param name="modelBuilder">The builder being used to construct the model for this context. Databases (and other extensions) typically
		/// define extension methods on this object that allow you to configure aspects of the model that are specific
		/// to a given database.</param>
		private void SeedIdentityServerConfiguration(ModelBuilder modelBuilder) {

			// auth.ApiResources
			modelBuilder.Entity<ApiResource>()
				.HasData(
					new ApiResource {
						Id = 1,
						DisplayName = "Scope for the dataEventRecords ApiResource",
						Enabled = true,
						Name = "dataEventRecords",
						Created = DateTime.Now,
						NonEditable = true
					}
				);

			// auth.ApiClaims
			modelBuilder.Entity<ApiResourceClaim>()
				.HasData(
					new ApiResourceClaim { Id = 1, ApiResourceId = 1, Type = "role" },
					new ApiResourceClaim { Id = 2, ApiResourceId = 1, Type = "admin" },
					new ApiResourceClaim { Id = 3, ApiResourceId = 1, Type = "user" },
					new ApiResourceClaim { Id = 4, ApiResourceId = 1, Type = "dataEventRecords" },
					new ApiResourceClaim { Id = 5, ApiResourceId = 1, Type = "dataEventRecords.admin" },
					new ApiResourceClaim { Id = 6, ApiResourceId = 1, Type = "dataEventRecords.user" }
				);

			// auth.ApiScopes
			modelBuilder.Entity<ApiScope>()
				.HasData(
					new ApiScope {
						Id = 1,
						ApiResourceId = 1,
						DisplayName = "Scope for the dataEventRecords ApiResource",
						Emphasize = false,
						Name = "dataEventRecords",
						Required = false,
						ShowInDiscoveryDocument = true
					}
				);

			// auth.Clients
			modelBuilder.Entity<Client>()
				.HasData(
					new Client {
						Id = 1,
						AbsoluteRefreshTokenLifetime = 2592000,
						AccessTokenLifetime = 3600,
						AccessTokenType = 0,
						AllowAccessTokensViaBrowser = true,
						AllowOfflineAccess = true,
						AllowPlainTextPkce = false,
						AllowRememberConsent = true,
						AlwaysIncludeUserClaimsInIdToken = true,
						AlwaysSendClientClaims = false,
						AuthorizationCodeLifetime = 300,
						BackChannelLogoutSessionRequired = true,
						ClientId = "simple-cms",
						ClientName = "Simple CMS",
						ClientUri = "http://localhost:4200",
						EnableLocalLogin = true,
						Enabled = true,
						FrontChannelLogoutSessionRequired = true,
						IdentityTokenLifetime = 3000,
						IncludeJwtId = false,
						ProtocolType = "oidc",
						RefreshTokenExpiration = 1,
						RefreshTokenUsage = 1,
						RequireClientSecret = true,
						RequireConsent = false,
						RequirePkce = false,
						SlidingRefreshTokenLifetime = 1296000,
						UpdateAccessTokenClaimsOnRefresh = false,
						Created = DateTime.Now,
						NonEditable = true,
						DeviceCodeLifetime = 300
					}
				);

			// auth.ClientCorsOrigins
			modelBuilder.Entity<ClientCorsOrigin>()
				.HasData(
					new ClientCorsOrigin { Id = 1, ClientId = 1, Origin = "http://localhost:4200" },
					new ClientCorsOrigin { Id = 2, ClientId = 1, Origin = "https://localhost:44300" }
				);

			// auth.ClientGrantTypes
			modelBuilder.Entity<ClientGrantType>()
				.HasData(
					new ClientGrantType { Id = 1, ClientId = 1, GrantType = "implicit" }
				);

			// auth.ClientPostLegoutRedirectUris
			modelBuilder.Entity<ClientPostLogoutRedirectUri>()
				.HasData(
					new ClientPostLogoutRedirectUri {
						Id = 1,
						ClientId = 1,
						PostLogoutRedirectUri = "http://localhost:4200"
					},
					new ClientPostLogoutRedirectUri {
						Id = 2,
						ClientId = 1,
						PostLogoutRedirectUri = "http://localhost:4200/auth/unauthorized"
					},
					new ClientPostLogoutRedirectUri {
						Id = 3,
						ClientId = 1,
						PostLogoutRedirectUri = "https://localhost:44300"
					},
					new ClientPostLogoutRedirectUri {
						Id = 4,
						ClientId = 1,
						PostLogoutRedirectUri = "https://localhost:44300/auth/unauthorized"
					}
				);

			// auth.ClientRedirectUris
			modelBuilder.Entity<ClientRedirectUri>()
				.HasData(
					new ClientRedirectUri {
						Id = 1,
						ClientId = 1,
						RedirectUri = "http://localhost:4200/assets/pages/auth_callback.html"
					},
					new ClientRedirectUri {
						Id = 2,
						ClientId = 1,
						RedirectUri = "https://localhost:44300/assets/pages/auth_callback.html"
					}
				);

			// auth.ClientScopes
			modelBuilder.Entity<ClientScope>()
				.HasData(
					new ClientScope { Id = 1, ClientId = 1, Scope = "openid" },
					new ClientScope { Id = 2, ClientId = 1, Scope = "dataEventRecords" },
					new ClientScope { Id = 3, ClientId = 1, Scope = "dataeventrecordsscope" },
					new ClientScope { Id = 4, ClientId = 1, Scope = "role" },
					new ClientScope { Id = 5, ClientId = 1, Scope = "profile" },
					new ClientScope { Id = 6, ClientId = 1, Scope = "email" }
				);

			// auth.IdentityResources
			modelBuilder.Entity<IdentityResource>()
				.HasData(
					new IdentityResource {
						Id = 1,
						DisplayName = "Your user identifier",
						Emphasize = false,
						Enabled = true,
						Name = "openid",
						Required = true,
						ShowInDiscoveryDocument = true,
						Created = DateTime.Now,
						NonEditable = true
					},
					new IdentityResource {
						Id = 2,
						Description = "Your user profile information (first name, last name, etc.)",
						DisplayName = "User profile",
						Emphasize = true,
						Enabled = true,
						Name = "profile",
						Required = false,
						ShowInDiscoveryDocument = true,
						Created = DateTime.Now,
						NonEditable = true
					},
					new IdentityResource {
						Id = 3,
						DisplayName = "Your email address",
						Emphasize = true,
						Enabled = true,
						Name = "email",
						Required = false,
						ShowInDiscoveryDocument = true,
						Created = DateTime.Now,
						NonEditable = true
					},
					new IdentityResource {
						Id = 4,
						DisplayName = "dataeventrecordsscope",
						Emphasize = false,
						Enabled = true,
						Name = "dataeventrecordsscope",
						Required = false,
						ShowInDiscoveryDocument = true,
						Created = DateTime.Now,
						NonEditable = true
					},
					new IdentityResource {
						Id = 5,
						DisplayName = "securedfilesscope",
						Emphasize = false,
						Enabled = true,
						Name = "portal-api",
						Required = false,
						ShowInDiscoveryDocument = true,
						Created = DateTime.Now,
						NonEditable = true
					}
				);

			// auth.IdentifyClaims
			modelBuilder.Entity<IdentityClaim>()
				.HasData(
					new IdentityClaim { Id = 1, IdentityResourceId = 1, Type = "sub" },
					new IdentityClaim { Id = 2, IdentityResourceId = 5, Type = "securedFiles" },
					new IdentityClaim { Id = 3, IdentityResourceId = 5, Type = "user" },
					new IdentityClaim { Id = 4, IdentityResourceId = 5, Type = "admin" },
					new IdentityClaim { Id = 5, IdentityResourceId = 5, Type = "role" },
					new IdentityClaim { Id = 6, IdentityResourceId = 4, Type = "dataEventRecords.user" },
					new IdentityClaim { Id = 7, IdentityResourceId = 4, Type = "dataEventRecords.admin" },
					new IdentityClaim { Id = 8, IdentityResourceId = 4, Type = "dataEventRecords" },
					new IdentityClaim { Id = 9, IdentityResourceId = 4, Type = "user" },
					new IdentityClaim { Id = 10, IdentityResourceId = 4, Type = "admin" },
					new IdentityClaim { Id = 11, IdentityResourceId = 4, Type = "role" },
					new IdentityClaim { Id = 12, IdentityResourceId = 3, Type = "email_verified" },
					new IdentityClaim { Id = 13, IdentityResourceId = 3, Type = "email" },
					new IdentityClaim { Id = 14, IdentityResourceId = 5, Type = "securedFiles.admin" },
					new IdentityClaim { Id = 15, IdentityResourceId = 2, Type = "updated_at" },
					new IdentityClaim { Id = 16, IdentityResourceId = 2, Type = "zoneinfo" },
					new IdentityClaim { Id = 17, IdentityResourceId = 2, Type = "birthdate" },
					new IdentityClaim { Id = 18, IdentityResourceId = 2, Type = "gender" },
					new IdentityClaim { Id = 19, IdentityResourceId = 2, Type = "website" },
					new IdentityClaim { Id = 20, IdentityResourceId = 2, Type = "picture" },
					new IdentityClaim { Id = 21, IdentityResourceId = 2, Type = "profile" },
					new IdentityClaim { Id = 22, IdentityResourceId = 2, Type = "preferred_username" },
					new IdentityClaim { Id = 23, IdentityResourceId = 2, Type = "nickname" },
					new IdentityClaim { Id = 24, IdentityResourceId = 2, Type = "middle_name" },
					new IdentityClaim { Id = 25, IdentityResourceId = 2, Type = "given_name" },
					new IdentityClaim { Id = 26, IdentityResourceId = 2, Type = "family_name" },
					new IdentityClaim { Id = 27, IdentityResourceId = 2, Type = "name" },
					new IdentityClaim { Id = 28, IdentityResourceId = 2, Type = "locale" },
					new IdentityClaim { Id = 29, IdentityResourceId = 5, Type = "securedFiles.user" }
				);
		}

	}

}

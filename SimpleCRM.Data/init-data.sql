USE [SimpleCRM]
GO
SET IDENTITY_INSERT [auth].[ApiResources] ON

GO
INSERT [auth].[ApiResources] ([Id], [Description], [DisplayName], [Enabled], [Name], [Created], [NonEditable]) VALUES (1, NULL, N'Scope for the dataEventRecords ApiResource', 1, N'dataEventRecords', getdate(), 1)
GO
SET IDENTITY_INSERT [auth].[ApiResources] OFF
GO
SET IDENTITY_INSERT [auth].[ApiClaims] ON 

GO
INSERT [auth].[ApiClaims] ([Id], [ApiResourceId], [Type]) VALUES (1, 1, N'role')
GO
INSERT [auth].[ApiClaims] ([Id], [ApiResourceId], [Type]) VALUES (2, 1, N'admin')
GO
INSERT [auth].[ApiClaims] ([Id], [ApiResourceId], [Type]) VALUES (3, 1, N'user')
GO
INSERT [auth].[ApiClaims] ([Id], [ApiResourceId], [Type]) VALUES (4, 1, N'dataEventRecords')
GO
INSERT [auth].[ApiClaims] ([Id], [ApiResourceId], [Type]) VALUES (5, 1, N'dataEventRecords.admin')
GO
INSERT [auth].[ApiClaims] ([Id], [ApiResourceId], [Type]) VALUES (6, 1, N'dataEventRecords.user')
GO
SET IDENTITY_INSERT [auth].[ApiClaims] OFF
GO
SET IDENTITY_INSERT [auth].[ApiScopes] ON

GO
INSERT [auth].[ApiScopes] ([Id], [ApiResourceId], [Description], [DisplayName], [Emphasize], [Name], [Required], [ShowInDiscoveryDocument]) VALUES (1, 1, NULL, N'Scope for the dataEventRecords ApiResource', 0, N'dataEventRecords', 0, 1)
GO
SET IDENTITY_INSERT [auth].[ApiScopes] OFF
GO
SET IDENTITY_INSERT [auth].[Clients] ON 

GO
INSERT [auth].[Clients] ( [Id], [AbsoluteRefreshTokenLifetime], [AccessTokenLifetime], [AccessTokenType], [AllowAccessTokensViaBrowser], [AllowOfflineAccess], [AllowPlainTextPkce], [AllowRememberConsent], [AlwaysIncludeUserClaimsInIdToken], [AlwaysSendClientClaims], [AuthorizationCodeLifetime], [BackChannelLogoutSessionRequired], [BackChannelLogoutUri], [ClientClaimsPrefix], [ClientId], [ClientName], [ClientUri], [ConsentLifetime], [Description], [EnableLocalLogin], [Enabled], [FrontChannelLogoutSessionRequired], [FrontChannelLogoutUri], [IdentityTokenLifetime], [IncludeJwtId], [LogoUri], [PairWiseSubjectSalt], [ProtocolType], [RefreshTokenExpiration], [RefreshTokenUsage], [RequireClientSecret], [RequireConsent], [RequirePkce], [SlidingRefreshTokenLifetime], [UpdateAccessTokenClaimsOnRefresh], [Created], [NonEditable], [DeviceCodeLifetime] ) VALUES ( 1, 2592000, 3600, 0, 1, 1, 0, 1,  1, 0, 300, 1,  NULL, NULL, N'simple-crm', N'Simple CRM', N'https://localhost:44300', NULL, NULL, 1, 1, 1, NULL, 3000, 0, NULL, NULL, N'oidc', 1, 1, 1, 1, 0, 1296000, 0, getdate(), 1, 300 )
GO
SET IDENTITY_INSERT [auth].[Clients] OFF
GO
SET IDENTITY_INSERT [auth].[ClientCorsOrigins] ON 

GO
INSERT [auth].[ClientCorsOrigins] ([Id], [ClientId], [Origin]) VALUES (1, 1, N'http://localhost:4200')
INSERT [auth].[ClientCorsOrigins] ([Id], [ClientId], [Origin]) VALUES (2, 1, N'https://localhost:44300')
GO
SET IDENTITY_INSERT [auth].[ClientCorsOrigins] OFF
GO
SET IDENTITY_INSERT [auth].[ClientGrantTypes] ON 

GO
INSERT [auth].[ClientGrantTypes] ([Id], [ClientId], [GrantType]) VALUES (1, 1, N'implicit')
GO
SET IDENTITY_INSERT [auth].[ClientGrantTypes] OFF
GO
SET IDENTITY_INSERT [auth].[ClientPostLogoutRedirectUris] ON 

GO
INSERT [auth].[ClientPostLogoutRedirectUris] ([Id], [ClientId], [PostLogoutRedirectUri]) VALUES (1, 1, N'http://localhost:4200')
GO
INSERT [auth].[ClientPostLogoutRedirectUris] ([Id], [ClientId], [PostLogoutRedirectUri]) VALUES (2, 1, N'http://localhost:4200/auth/unauthorized')
GO
INSERT [auth].[ClientPostLogoutRedirectUris] ([Id], [ClientId], [PostLogoutRedirectUri]) VALUES (3, 1, N'https://localhost:44300')
GO
INSERT [auth].[ClientPostLogoutRedirectUris] ([Id], [ClientId], [PostLogoutRedirectUri]) VALUES (4, 1, N'https://localhost:44300/auth/unauthorized')
GO
SET IDENTITY_INSERT [auth].[ClientPostLogoutRedirectUris] OFF
GO
SET IDENTITY_INSERT [auth].[ClientRedirectUris] ON 

GO
INSERT [auth].[ClientRedirectUris] ([Id], [ClientId], [RedirectUri]) VALUES (1, 1, N'http://localhost:4200/assets/pages/auth_callback.html')
GO
INSERT [auth].[ClientRedirectUris] ([Id], [ClientId], [RedirectUri]) VALUES (2, 1, N'https://localhost:44300/assets/pages/auth_callback.html')
GO
SET IDENTITY_INSERT [auth].[ClientRedirectUris] OFF
GO
SET IDENTITY_INSERT [auth].[ClientScopes] ON 

GO
INSERT [auth].[ClientScopes] ([Id], [ClientId], [Scope]) VALUES (1, 1, N'openid')
GO
INSERT [auth].[ClientScopes] ([Id], [ClientId], [Scope]) VALUES (2, 1, N'dataEventRecords')
GO
INSERT [auth].[ClientScopes] ([Id], [ClientId], [Scope]) VALUES (3, 1, N'dataeventrecordsscope')
GO
INSERT [auth].[ClientScopes] ([Id], [ClientId], [Scope]) VALUES (4, 1, N'role')
GO
INSERT [auth].[ClientScopes] ([Id], [ClientId], [Scope]) VALUES (5, 1, N'profile')
GO
INSERT [auth].[ClientScopes] ([Id], [ClientId], [Scope]) VALUES (6, 1, N'email')
GO
SET IDENTITY_INSERT [auth].[ClientScopes] OFF
GO
SET IDENTITY_INSERT [auth].[IdentityResources] ON 

GO
INSERT [auth].[IdentityResources] ([Id], [Description], [DisplayName], [Emphasize], [Enabled], [Name], [Required], [ShowInDiscoveryDocument], [Created], [NonEditable]) VALUES (1, NULL, N'Your user identifier', 0, 1, N'openid', 1, 1, getdate(), 1)
GO
INSERT [auth].[IdentityResources] ([Id], [Description], [DisplayName], [Emphasize], [Enabled], [Name], [Required], [ShowInDiscoveryDocument], [Created], [NonEditable]) VALUES (2, N'Your user profile information (first name, last name, etc.)', N'User profile', 1, 1, N'profile', 0, 1, getdate(), 1)
GO
INSERT [auth].[IdentityResources] ([Id], [Description], [DisplayName], [Emphasize], [Enabled], [Name], [Required], [ShowInDiscoveryDocument], [Created], [NonEditable]) VALUES (3, NULL, N'Your email address', 1, 1, N'email', 0, 1, getdate(), 1)
GO
INSERT [auth].[IdentityResources] ([Id], [Description], [DisplayName], [Emphasize], [Enabled], [Name], [Required], [ShowInDiscoveryDocument], [Created], [NonEditable]) VALUES (4, NULL, N'dataeventrecordsscope', 0, 1, N'dataeventrecordsscope', 0, 1, getdate(), 1)
GO
INSERT [auth].[IdentityResources] ([Id], [Description], [DisplayName], [Emphasize], [Enabled], [Name], [Required], [ShowInDiscoveryDocument], [Created], [NonEditable]) VALUES (5, NULL, N'securedfilesscope', 0, 1, N'portal-api', 0, 1, getdate(), 1)
GO
SET IDENTITY_INSERT [auth].[IdentityResources] OFF
GO
SET IDENTITY_INSERT [auth].[IdentityClaims] ON

GO
INSERT INTO [auth].[IdentityClaims] ([Id], [IdentityResourceId], [Type]) VALUES (1, 1, N'sub')
GO
INSERT INTO [auth].[IdentityClaims] ([Id], [IdentityResourceId], [Type]) VALUES (2, 5, N'securedFiles')
GO
INSERT INTO [auth].[IdentityClaims] ([Id], [IdentityResourceId], [Type]) VALUES (3, 5, N'user')
GO
INSERT INTO [auth].[IdentityClaims] ([Id], [IdentityResourceId], [Type]) VALUES (4, 5, N'admin')
GO
INSERT INTO [auth].[IdentityClaims] ([Id], [IdentityResourceId], [Type]) VALUES (5, 5, N'role')
GO
INSERT INTO [auth].[IdentityClaims] ([Id], [IdentityResourceId], [Type]) VALUES (6, 4, N'dataEventRecords.user')
GO
INSERT INTO [auth].[IdentityClaims] ([Id], [IdentityResourceId], [Type]) VALUES (7, 4, N'dataEventRecords.admin')
GO
INSERT INTO [auth].[IdentityClaims] ([Id], [IdentityResourceId], [Type]) VALUES (8, 4, N'dataEventRecords')
GO
INSERT INTO [auth].[IdentityClaims] ([Id], [IdentityResourceId], [Type]) VALUES (9, 4, N'user')
GO
INSERT INTO [auth].[IdentityClaims] ([Id], [IdentityResourceId], [Type]) VALUES (10, 4, N'admin')
GO
INSERT INTO [auth].[IdentityClaims] ([Id], [IdentityResourceId], [Type]) VALUES (11, 4, N'role')
GO
INSERT INTO [auth].[IdentityClaims] ([Id], [IdentityResourceId], [Type]) VALUES (12, 3, N'email_verified')
GO
INSERT INTO [auth].[IdentityClaims] ([Id], [IdentityResourceId], [Type]) VALUES (13, 3, N'email')
GO
INSERT INTO [auth].[IdentityClaims] ([Id], [IdentityResourceId], [Type]) VALUES (14, 5, N'securedFiles.admin')
GO
INSERT INTO [auth].[IdentityClaims] ([Id], [IdentityResourceId], [Type]) VALUES (15, 2, N'updated_at')
GO
INSERT INTO [auth].[IdentityClaims] ([Id], [IdentityResourceId], [Type]) VALUES (16, 2, N'zoneinfo')
GO
INSERT INTO [auth].[IdentityClaims] ([Id], [IdentityResourceId], [Type]) VALUES (17, 2, N'birthdate')
GO
INSERT INTO [auth].[IdentityClaims] ([Id], [IdentityResourceId], [Type]) VALUES (18, 2, N'gender')
GO
INSERT INTO [auth].[IdentityClaims] ([Id], [IdentityResourceId], [Type]) VALUES (19, 2, N'website')
GO
INSERT INTO [auth].[IdentityClaims] ([Id], [IdentityResourceId], [Type]) VALUES (20, 2, N'picture')
GO
INSERT INTO [auth].[IdentityClaims] ([Id], [IdentityResourceId], [Type]) VALUES (21, 2, N'profile')
GO
INSERT INTO [auth].[IdentityClaims] ([Id], [IdentityResourceId], [Type]) VALUES (22, 2, N'preferred_username')
GO
INSERT INTO [auth].[IdentityClaims] ([Id], [IdentityResourceId], [Type]) VALUES (23, 2, N'nickname')
GO
INSERT INTO [auth].[IdentityClaims] ([Id], [IdentityResourceId], [Type]) VALUES (24, 2, N'middle_name')
GO
INSERT INTO [auth].[IdentityClaims] ([Id], [IdentityResourceId], [Type]) VALUES (25, 2, N'given_name')
GO
INSERT INTO [auth].[IdentityClaims] ([Id], [IdentityResourceId], [Type]) VALUES (26, 2, N'family_name')
GO
INSERT INTO [auth].[IdentityClaims] ([Id], [IdentityResourceId], [Type]) VALUES (27, 2, N'name')
GO
INSERT INTO [auth].[IdentityClaims] ([Id], [IdentityResourceId], [Type]) VALUES (28, 2, N'locale')
GO
INSERT INTO [auth].[IdentityClaims] ([Id], [IdentityResourceId], [Type]) VALUES (29, 5, N'securedFiles.user')
GO
SET IDENTITY_INSERT [auth].[IdentityClaims] OFF
GO
SET IDENTITY_INSERT [dbo].[Users] ON 

GO
 INSERT [dbo].[Users] ([UserId], [AccessFailedCount], [ConcurrencyStamp], [Email], [EmailConfirmed], [IsAdmin], [DataEventRecordsRole], [SecuredFilesRole], [LockoutEnabled], [LockoutEnd], [NormalizedEmail], [NormalizedUserName], [PasswordHash], [PhoneNumber], [PhoneNumberConfirmed], [SecurityStamp], [TwoFactorEnabled], [UserName]) VALUES (1, 0, 'fe80632a-a20f-4510-9237-205ebab34516', N'test@test.com', 0, 0, NULL, NULL, 1, NULL, N'TEST@TEST.COM', N'TEST@TEST.COM', N'AQAAAAEAACcQAAAAEEh1H8KfznRWQglPFMBIyzLo4AevzKuZYHJq+1vw6sZsvJQgbiIIJYJaTtXg0e3l7A==', NULL, 0, N'LFEFYRS5H6M3M7QURCCLH76HKHPWXQHZ', 0, N'test@test.com')
GO
SET IDENTITY_INSERT [dbo].[Users] OFF
GO

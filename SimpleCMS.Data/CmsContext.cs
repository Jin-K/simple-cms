using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SimpleCMS.Data.Config;
using SimpleCMS.Data.Entities;

namespace SimpleCMS.Data {

	/// <summary>
	/// The main CmsContext class
	/// <para>&#160;</para>
	/// Main database context of simple-cms
	/// </summary>
	/// <inheritdoc />
	public class CmsContext : IdentityDbContext<AppUser, AppRole, int> {

		#region DbSet<> properties are here

		#region Main DbSet<> properties of CmsContext

		/// <summary>Contains all accounts in database table dbo.Accounts</summary>
		/// <value>Get the value of Accounts</value>
		public DbSet<Account> Accounts { get; set; }

		/// <summary>Contains all entities in database table dbo.Entities</summary>
		/// <value>Get the value of Entities</value>
		public DbSet<Entity> Entities { get; set; }

		#endregion

		#region (Entities): Actions, Contacts, Companies

		/// <summary>Contains all actions in database table dbo.Actions</summary>
		/// <value>Get the value of Actions</value>
		public DbSet<Action> Actions { get; set; }

		/// <summary>Contains all contacts in database table dbo.Contacts</summary>
		/// <value>Get the value of Contacts</value>
		public DbSet<Contact> Contacts { get; set; }

		/// <summary>Contains all companies in database table dbo.Companies</summary>
		/// <value>Get the value of Companies</value>
		public DbSet<Company> Companies { get; set; }

		#endregion

		#region (Others, Misc): Labels, Widgets, Addresses, Favorites, NewsItemEntities, NewsGroups

		/// <summary>Contains all labels in database table dbo.Labels</summary>
		/// <value>Get the value of Labels</value>
		public DbSet<_Label> Labels { get; set; }

		/// <summary>Contains all widgets in database table dbo.Widgets</summary>
		/// <value>Get the value of Widgets</value>
		public DbSet<Widget> Widgets { get; set; }

		/// <summary>Contains all addresses in database table dbo.Addresses</summary>
		/// <value>Get the value of Addresses</value>
		public DbSet<Address> Addresses { get; set; }

		/// <summary>Contains all favorites in database table dbo.Favorites</summary>
		/// <value>Get the value of Favorites</value>
		public DbSet<Favorite> Favorites { get; set; }

		/// <summary>Contains all news item entities in database table dbo.NewsItemEntities</summary>
		/// <value>Get the value of NewsItemEntities</value>
		public DbSet<NewsItemEntity> NewsItemEntities { get; set; }

		/// <summary>Contains all news groups in database table dbo.NewsGroups</summary>
		/// <value>Get the value of NewsGroups</value>
		public DbSet<NewsGroup> NewsGroups { get; set; }

		#endregion

		#endregion

		/// <summary>
		/// Constructor
		/// </summary>
		/// <remarks>
		/// Sets correct sql statement for sql NOW (in <see cref="F:SimpleCMS.Data.CmsContext.DefaultNowSql" />)
		/// </remarks>
		/// <param name="options">The options to be used by a <see cref="T:Microsoft.EntityFrameworkCore.DbContext" /></param>
		/// <inheritdoc />
		// ReSharper disable once SuggestBaseTypeForParameter
		public CmsContext(DbContextOptions<CmsContext> options) : base( options ) { }

		/// <summary>
		/// Configures database tables.
		/// Override of <see cref="DbContext.OnModelCreating(ModelBuilder)" />
		/// </summary>
		/// <param name="builder">The builder being used to construct the model for this context. Databases (and other extensions) typically</param>
		/// <inheritdoc />
		protected override void OnModelCreating(ModelBuilder builder) {

			var isSqlServer = Database.IsSqlServer();

			#region CMS Tables

			// dbo.Label
			builder.ApplyConfiguration( new LabelConfig( isSqlServer ) );
			// dbo.Entities
			builder.ApplyConfiguration( new EntityConfig( isSqlServer ) );
			// dbo.Accounts
			builder.ApplyConfiguration( new AccountConfig( isSqlServer ) );
			// dbo.Contacts
			builder.ApplyConfiguration( new ContactConfig( isSqlServer ) );
			// dbo.Companies
			builder.ApplyConfiguration( new CompanyConfig( isSqlServer ) );
			// dbo.Actions
			builder.ApplyConfiguration( new ActionConfig( isSqlServer ) );
			// dbo.Addresses
			builder.ApplyConfiguration( new AddressConfig( isSqlServer ) );
			// dbo.Favorites
			builder.ApplyConfiguration( new FavoriteConfig( isSqlServer ) );
			// dbo.Widgets
			builder.ApplyConfiguration( new WidgetConfig( isSqlServer ) );
			// dbo.NewsItemEntities
			builder.ApplyConfiguration( new NewsItemsConfig() );
			// dbo.NewsGroups      
			builder.ApplyConfiguration( new NewsGroupConfig() );

			#endregion

			#region Identity Auth Tables

			// dbo.Users
			builder.ApplyConfiguration( new AppUserConfig() );
			// dbo.Roles
			builder.ApplyConfiguration( new AppRoleConfig() );
			// auth.UserRoles      
			builder.ApplyConfiguration( new IdentityUserRoleConfig() );
			// auth.UserClaims      
			builder.ApplyConfiguration( new IdentityUserClaimConfig() );
			// auth.RoleClaims
			builder.ApplyConfiguration( new IdentityRoleClaimConfig() );
			// auth.UserLogins
			builder.ApplyConfiguration( new IdentityUserLoginConfig() );
			// auth.UserTokens      
			builder.ApplyConfiguration( new IdentityUserTokenConfig() );

			#endregion

		}

	}

}

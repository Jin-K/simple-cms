﻿using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer.Infrastructure.Internal;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SimpleCMS.Data.Entities;
using SimpleCMS.Data.Extensions;
using Action = SimpleCMS.Data.Entities.Action;

namespace SimpleCMS.Data {

	/// <summary>
	/// The main CmsContext class
	/// <para>&#160;</para>
	/// Main database context of simple-cms
	/// </summary>
	public class CmsContext : IdentityDbContext<AppUser, AppRole, int> {

    /// <summary>
    /// Public static hardcoded connection string, 
    /// I think it is needed for auto-generated db contexts in SimpleCMS.Data/Migrations
    /// <para>&#160;</para>
    /// <seealso cref="TemporaryCmsContext.CreateDbContext(string[])"/>
    /// <para>&#160;</para>
    /// <seealso cref="TemporaryPersistedGrantDbContext.CreateDbContext(string[])"/>
    /// <para>&#160;</para>
    /// <seealso cref="TemporaryConfigurationDbContext.CreateDbContext(string[])"/>
    /// </summary>
    internal const string HcConnectionString = "Data Source=localhost;Initial Catalog=SimpleCMS;Integrated Security=False;User ID=user1;Password=Password123";

    /// <summary>
    /// Constant string delimiter for array of string during ef core conversion
    /// <para>&#160;</para>
    /// <seealso cref="aosToSConverter" />
    /// </summary>
    private const string AosDelimiter = "d;^_°;b";

    /// <summary>
    /// Type of database context ==> SQL Server, Sqlite, ...
    /// </summary>
    private readonly ContextType contextType;

    /// <summary>
    /// Sql statement to get sql NOW datetime ==> getdate(), now(), datetime('now'), ...
    /// </summary>
    internal static string DefaultNowSql;

    /// <summary>
    /// Array of string to string converter
    /// </summary>
    /// <remarks>
    /// Is used by EF core >=2.1 method: <see cref="Microsoft.EntityFrameworkCore.Metadata.Builders.PropertyBuilder{TProperty}.HasConversion{TProvider}(ValueConverter{TProperty, TProvider})" />
    /// </remarks>
    /// <typeparam name="string[]">c# array of string type property</typeparam>
    /// <typeparam name="string">sql raw string type provider</typeparam>
    /// <value>Value of the converter</value>
    readonly ValueConverter<string[], string> aosToSConverter = new ValueConverter<string[], string>( c_aos => string.Join(AosDelimiter, c_aos),  s_s => s_s.Split(AosDelimiter, StringSplitOptions.RemoveEmptyEntries) );
    
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

    #region (Others): Accounts, NewsGroups, Labels, Widgets

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

    #endregion
    
    #region NewsItemEntities, NewsGroups

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
    /// <param name="options">The options to be used by a <see cref="DbContext" /></param>
    public CmsContext(DbContextOptions<CmsContext> options) : base( options ) {

      // detect and set context type
      contextType = options.FindExtension<SqlServerOptionsExtension>() != null ? ContextType.SqlServer : ContextType.Sqlite;

      // set correct sql statement for sql NOW
      DefaultNowSql = contextType == ContextType.SqlServer ? "getdate()" : "datetime('now')";
    }

    /// <summary>
    /// Configures database tables.
    /// Override of <see cref="DbContext.OnModelCreating(ModelBuilder)" />
    /// </summary>
    /// <param name="builder">The builder being used to construct the model for this context. Databases (and other extensions) typically</param>
    protected override void OnModelCreating(ModelBuilder builder) {

      #region CMS Tables

      // dbo.Label
      builder.Entity<_Label>( labelBuilder => {

        // set dbo.Labels.Created's default value to sql NOW value
        labelBuilder.Property( l => l.Created ).HasDefaultValueSql( DefaultNowSql );

        // set dbo.Labels.Custom's default value to 0 (false)
        labelBuilder.Property( l => l.Custom ).HasDefaultValueSql( "0" );

        // seed dbo.Labels table
        labelBuilder.HasData(
          new _Label { Id = 1, Label = "Sociétés" },
          new _Label { Id = 2, Label = "Contacts" },
          new _Label { Id = 3, Label = "Projets" },
          new _Label { Id = 4, Label = "Documents" },
          new _Label { Id = 5, Label = "Actions" }
        );
      } );

      // dbo.Entities
      builder.Entity<Entity>( entityBuilder => {

        // set dbo.Entities.Created's default value to sql NOW value
        entityBuilder.Property( e => e.Created ).HasDefaultValueSql( DefaultNowSql );

        // set dbo.Entities.Custom's default value to 0 (false)
        entityBuilder.Property( e => e.Custom ).HasDefaultValueSql( "0" );

        // seed dbo.Entities table
        entityBuilder.HasData(
          new Entity { Id = 10, Name = "Companies", LabelId = 1 },
          new Entity { Id = 11, Name = "Contacts", LabelId = 2 },
          new Entity { Id = 20, Name = "Projects", LabelId = 3 },
          new Entity { Id = 31, Name = "Documents", LabelId = 4 },
          new Entity { Id = 32, Name = "Actions", LabelId = 5 }
        );
      } );

      // dbo.Accounts
      builder.Entity<Account>().Property( a => a.Created ).HasDefaultValueSql( DefaultNowSql );

      // dbo.Contacts
      builder.Entity<Contact>( contactBuilder => {

        // set dbo.Contacts.Created's default value to sql NOW value
        contactBuilder.Property( c => c.Created ).HasDefaultValueSql( DefaultNowSql );
        
        // inform EF core that some properties need CLR conversion (using aosToSConverter)
        contactBuilder.Property( c => c.Phones ).HasConversion(aosToSConverter);
        contactBuilder.Property( c => c.Faxes ).HasConversion(aosToSConverter);
        contactBuilder.Property( c => c.Websites ).HasConversion(aosToSConverter);
        contactBuilder.Property( c => c.Emails ).HasConversion(aosToSConverter);

        // seed dbo.Contacts table
        var i = 0;
        contactBuilder.HasData(
          new Contact { Id = 1, FirstName = "Angel", LastName = "Muñoz", Created = "16/08/2018 12:30:05.237".ToDateTime(), Emails = new []{ "angelmnz@outlook.com", "angel.munoz@amma.be" } },
          new Contact { Id = 2, FirstName = "Pablo", LastName = "Muñoz", Created = "17/08/2018 09:00:00.000".ToDateTime() },
          new Contact { Id = 3, FirstName = "qrqrg", LastName = "gqzgq" },
          new Contact { Id = 4, FirstName = "sgs", LastName = "rg er g", Created = DateTime.Now.AddMinutes( ++i * -25 ) },
          new Contact { Id = 5, FirstName = "uuj", LastName = "yhy", Created = DateTime.Now.AddMinutes( ++i * -25 ) },
          new Contact { Id = 6, FirstName = "ffdb ", LastName = "dfggg", Created = DateTime.Now.AddMinutes( ++i * -25 ) },
          new Contact { Id = 7, FirstName = "uezbf", LastName = "pzgp", Created = DateTime.Now.AddMinutes( ++i * -25 ) },
          new Contact { Id = 8, FirstName = "test", LastName = "test", Created = DateTime.Now.AddMinutes( ++i * -25 ), Emails = new []{ "test@test.com" } },
          new Contact { Id = 9, FirstName = "testing", LastName = "Rivera", Created = DateTime.Now.AddMinutes( ++i * -25 ) },
          new Contact { Id = 10, FirstName = "zetest", LastName = "Kesako", Created = DateTime.Now.AddMinutes( ++i * -25 ) },
          new Contact { Id = 11, FirstName = "Super", LastName = "Mario", Created = DateTime.Now.AddMinutes( ++i * -25 ) },
          new Contact { Id = 12, FirstName = "Kestu", LastName = "Veux", Created = DateTime.Now.AddMinutes( ++i * -25 ) },
          new Contact { Id = 13, FirstName = "Pablo", LastName = "Escobar", Created = DateTime.Now.AddMinutes( ++i * -25 ) },
          new Contact { Id = 14, FirstName = "aodnbaz", LastName = "epangzeg", Created = DateTime.Now.AddMinutes( ++i * -25 ) },
          new Contact { Id = 15, FirstName = "encore des", LastName = "spaghetti", Created = DateTime.Now.AddMinutes( ++i * -25 ) },
          new Contact { Id = 16, FirstName = "bon", LastName = "risoto", Created = DateTime.Now.AddMinutes( ++i * -25 ) },
          new Contact { Id = 17, FirstName = "Grosse", LastName = "caisse", Created = DateTime.Now.AddMinutes( ++i * -25 ) }
        );
      } );

      // dbo.Companies
      builder.Entity<Company>( companyBuilder => {

        // set dbo.Companies.Created's default value to sql NOW value
        companyBuilder.Property( c => c.Created ).HasDefaultValueSql( DefaultNowSql );
        
        // inform EF core that some properties need CLR conversion (using aosToSConverter)
        companyBuilder.Property( c => c.Phones ).HasConversion(aosToSConverter);
        companyBuilder.Property( c => c.Faxes ).HasConversion(aosToSConverter);
        companyBuilder.Property( c => c.Websites ).HasConversion(aosToSConverter);
        companyBuilder.Property( c => c.Emails ).HasConversion(aosToSConverter);

        // seed dbo.Companies table
        companyBuilder.HasData(
          new Company { Id = 1, Name = "Intense Designing", Created = DateTime.Now.AddDays(-3) },
          new Company { Id = 2, Name = "Jin-K Empire" }
        );
      } );

      // dbo.Actions
      builder.Entity<Action>( actionBuilder => {

        // set dbo.Actions.Created's default value to sql NOW value
        actionBuilder.Property( c => c.Created ).HasDefaultValueSql( DefaultNowSql );

        // seed dbo.Actions table
        actionBuilder.HasData(
          new Action { Id = 1 }
        );
      } );

      // dbo.Addresses
      builder.Entity<Address>( addressBuilder => {

        // set dbo.Addresses.Created's default value to sql NOW value
        addressBuilder.Property( c => c.Created ).HasDefaultValueSql( DefaultNowSql );

        // seed dbo.Addresses table
        addressBuilder.Property( c => c.Main ).HasDefaultValue( false );
        addressBuilder.HasData(
          new Address { Id = 1, ContactId = 1, Street = "Avenue des Arts", Number = "4", Zip = "1040", City = "Brussels", Country = "BE" },
          new Address { Id = 2, Name = "Planque", Main = true, ContactId = 1, Street = "Rue d'en dessous", Number = "11", Zip = "75000", City = "Paris", Country = "FR" },
          new Address { Id = 3, Main = true, ContactId = 2, Street = "Chaussée des délires", Number = "357", Zip = "1337", City = "South Park", Country = "BE" },
          new Address { Id = 4, Name = "QG", Main = true, CompanyId = 2, Street = "Place de la duchesse", Zip = "1080", City = "Brussels", Country = "BE" }
        );
      });

      // dbo.Favorites
      builder.Entity<Favorite>( favoritesBuilder => {

        // clustered primary key
        favoritesBuilder.HasKey( c => new { c.UserId, c.EntityId, c.ItemId } );

        // set dbo.Favorites.Created's default value to sql NOW value
        favoritesBuilder.Property( f => f.Created ).HasDefaultValueSql( DefaultNowSql );

        // seed dbo.Favorites table
        favoritesBuilder.HasData(
          new Favorite(1, 11, 1),
          new Favorite(1, 11, 3),
          new Favorite(1, 11, 7),
          new Favorite(1, 11, 11),
          new Favorite(1, 11, 16),
          new Favorite(1, 10, 2),
          new Favorite(1, 32, 1)
        );
      } );

      // dbo.Widgets
      builder.ApplyConfiguration(new WidgetConfig());

      // dbo.NewsItemEntities
      builder.ApplyConfiguration(new NewsItemsConfig());

      // dbo.NewsGroups      
      builder.ApplyConfiguration(new NewsGroupConfig());

      #endregion

      #region Identity Auth Tables

      // dbo.Users
      builder.Entity<AppUser>(userBuilder => {

        // rename table as dbo.Users
        userBuilder.ToTable( "Users" );

        // rename Id column as dbo.Users.UserId
        userBuilder.Property(p => p.Id).HasColumnName( "UserId" );

        // create default test user
        userBuilder.HasData(new AppUser {
          Id = 1,
          AccessFailedCount = 0,
          ConcurrencyStamp = "fe80632a-a20f-4510-9237-205ebab34516",
          Email = "test@test.com",
          EmailConfirmed = false,
          IsAdmin = false,
          DataEventRecordsRole = null,
          SecuredFilesRole = null,
          LockoutEnabled = true,
          LockoutEnd = null,
          NormalizedEmail = "TEST@TEST.COM",
          NormalizedUserName = "TEST@TEST.COM",
          PasswordHash = "AQAAAAEAACcQAAAAEEh1H8KfznRWQglPFMBIyzLo4AevzKuZYHJq+1vw6sZsvJQgbiIIJYJaTtXg0e3l7A==",
          PhoneNumber = null,
          PhoneNumberConfirmed = false,
          SecurityStamp = "LFEFYRS5H6M3M7QURCCLH76HKHPWXQHZ",
          TwoFactorEnabled = false,
          UserName = "test@test.com"
        });
      });

      // dbo.Roles
      builder.Entity<AppRole>().ToTable("Roles")
        .Property(p => p.Id).HasColumnName("RoleId");

      // auth.UserRoles      
      builder.Entity<IdentityUserRole<int>>().ToTable("UserRoles", "auth")
        .HasKey(p => new { p.RoleId, p.UserId });

      // auth.UserClaims      
      builder.Entity<IdentityUserClaim<int>>().ToTable("UserClaims", "auth")
        .Property(e => e.Id).HasColumnName("UserClaimId");
      
      // auth.RoleClaims
      builder.Entity<IdentityRoleClaim<int>>().ToTable("RoleClaims", "auth")
        .Property(p => p.Id).HasColumnName("RoleClaimId");
      
      // auth.UserLogins
      builder.Entity<IdentityUserLogin<int>>().ToTable("UserLogins", "auth")
        .HasKey(p => new { p.LoginProvider, p.ProviderKey });

      // auth.UserTokens      
      builder.Entity<IdentityUserToken<int>>().ToTable("UserTokens", "auth")
        .HasKey(p => new { p.UserId, p.LoginProvider, p.Name });
      
      #endregion
    
    }
  
  }

  /// <summary>
  /// The main ContextType enum
  /// </summary>
  /// <remarks>
  /// Used in <see cref="CmsContext" /> constructor to determine the type of database
  /// </remarks>
  internal enum ContextType {
    SqlServer,
    Sqlite
  }

}

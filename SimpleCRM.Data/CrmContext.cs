using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer.Infrastructure.Internal;
using SimpleCRM.Data.Entities;
using SimpleCRM.Data.Extensions;
using System;

using Action = SimpleCRM.Data.Entities.Action;

namespace SimpleCRM.Data {
  public class CrmContext : IdentityDbContext<AppUser, AppRole, int> {

    public const string HC_CONNECTION_STRING = "Data Source=localhost;Initial Catalog=SimpleCRM;Integrated Security=False;User ID=user1;Password=Password123";

    readonly ContextType contextType;

    internal static string DefaultNowSql;

    #region Entities
    public DbSet<Action> Actions { get; set; }
    public DbSet<Contact> Contacts { get; set; }
    public DbSet<Company> Companies { get; set; }
    #endregion

    public DbSet<Account> Accounts { get; set; }
    public DbSet<Entity> Entities { get; set; }
    public DbSet<_Label> Labels { get; set; }
    public DbSet<Widget> Widgets { get; set; }

    #region From NewsContext
    public DbSet<NewsItemEntity> NewsItemEntities { get; set; }
    public DbSet<NewsGroup> NewsGroups { get; set; }
    #endregion

    public CrmContext(DbContextOptions<CrmContext> options) : base( options ) {
      contextType = options.FindExtension<SqlServerOptionsExtension>() != null ? ContextType.SqlServer : ContextType.Sqlite;
      DefaultNowSql = contextType == ContextType.SqlServer ? "getdate()" : "datetime('now')";
    }

    protected override void OnModelCreating(ModelBuilder builder) {

      #region CRM Tables
      builder.Entity<_Label>( labelBuilder => {
        labelBuilder.Property( l => l.Created ).HasDefaultValueSql( DefaultNowSql );
        labelBuilder.Property( l => l.Custom ).HasDefaultValueSql( "0" );
        labelBuilder.HasData(
          new _Label {
            Id = 1,
            Label = "Sociétés"
          },
          new _Label {
            Id = 2,
            Label = "Contacts"
          },
          new _Label {
            Id = 3,
            Label = "Projets"
          },
          new _Label {
            Id = 4,
            Label = "Documents"
          },
          new _Label {
            Id = 5,
            Label = "Actions"
          }
        );
      } );
      
      builder.Entity<Entity>( entityBuilder => {
        entityBuilder.Property( e => e.Created ).HasDefaultValueSql( DefaultNowSql );
        entityBuilder.Property( e => e.Custom ).HasDefaultValueSql( "0" );
        entityBuilder.HasData(
          new Entity {
            Id = 10,
            Name = "Companies",
            LabelId = 1
          },
          new Entity {
            Id = 11,
            Name = "Contacts",
            LabelId = 2
          },
          new Entity {
            Id = 20,
            Name = "Projects",
            LabelId = 3
          },
          new Entity {
            Id = 31,
            Name = "Documents",
            LabelId = 4
          },
          new Entity {
            Id = 32,
            Name = "Actions",
            LabelId = 5
          }
        );
      } );

      builder.Entity<Account>().Property( a => a.Created ).HasDefaultValueSql( DefaultNowSql );

      builder.Entity<Contact>( contactBuilder => {
        contactBuilder.Property( c => c.Created ).HasDefaultValueSql( DefaultNowSql );
        
        contactBuilder.Property<string>( "PhonesCollection" ).HasField( "_phones" );
        contactBuilder.Property<string>( "FaxesCollection" ).HasField( "_faxes" );
        contactBuilder.Property<string>( "WebsitesCollection" ).HasField( "_websites" );
        contactBuilder.Property<string>( "EmailsCollection" ).HasField( "_emails" );
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
          new Contact { Id = 10, FirstName = "zetest", LastName = "Kesako", Created =DateTime.Now.AddMinutes( ++i * -25 ) },
          new Contact { Id = 11, FirstName = "Super", LastName = "Mario", Created =DateTime.Now.AddMinutes( ++i * -25 ) },
          new Contact { Id = 12, FirstName = "Kestu", LastName = "Veux", Created =DateTime.Now.AddMinutes( ++i * -25 ) },
          new Contact { Id = 13, FirstName = "Pablo", LastName = "Escobar", Created =DateTime.Now.AddMinutes( ++i * -25 ) },
          new Contact { Id = 14, FirstName = "aodnbaz", LastName = "epangzeg", Created =DateTime.Now.AddMinutes( ++i * -25 ) },
          new Contact { Id = 15, FirstName = "encore des", LastName = "spaghetti", Created =DateTime.Now.AddMinutes( ++i * -25 ) },
          new Contact { Id = 16, FirstName = "bon", LastName = "risoto", Created =DateTime.Now.AddMinutes( ++i * -25 ) },
          new Contact { Id = 17, FirstName = "Grosse", LastName = "caisse", Created = DateTime.Now.AddMinutes( ++i * -25 ) }
        );
      } );

      builder.Entity<Company>( companyBuilder => {
        companyBuilder.Property( c => c.Created ).HasDefaultValueSql( DefaultNowSql );
        companyBuilder.HasData(
          new Company { Id = 1, Name = "Intense Designing", Created = DateTime.Now.AddDays(-3) },
          new Company { Id = 2, Name = "Jin-K Empire" }
        );
      } );

      builder.Entity<Address>( addressBuilder => {
        addressBuilder.Property( c => c.Created ).HasDefaultValueSql( DefaultNowSql );
        addressBuilder.Property( c => c.Main ).HasDefaultValue( false );
        addressBuilder.HasData(
          new Address { Id = 1, ContactId = 1, Street = "Avenue des Arts", Number = "4", Zip = "1040", City = "Brussels", Country = "BE" },
          new Address { Id = 2, Name = "Planque", Main = true, ContactId = 1, Street = "Rue d'en dessous", Number = "11", Zip = "75000", City = "Paris", Country = "FR" },
          new Address { Id = 3, Main = true, ContactId = 2, Street = "Chaussée des délires", Number = "357", Zip = "1337", City = "South Park", Country = "BE" },
          new Address { Id = 4, Name = "QG", Main = true, CompanyId = 2, Street = "Place de la duchesse", Zip = "1080", City = "Brussels", Country = "BE" }
        );
      });

      builder.Entity<Action>( actionBuilder => {
        actionBuilder.Property( c => c.Created ).HasDefaultValueSql( DefaultNowSql );
        actionBuilder.HasData(
          new Action { Id = 1 }
        );
      } );

      builder.ApplyConfiguration(new WidgetConfig());

      builder.ApplyConfiguration(new NewsItemsConfig());
      
      builder.ApplyConfiguration(new NewsGroupConfig());
      #endregion

      #region Identity Auth Tables
      builder.Entity<AppUser>()
        .ToTable("Users")
        .Property(p => p.Id).HasColumnName("UserId");

      builder.Entity<AppRole>()
        .ToTable("Roles")
        .Property(p => p.Id).HasColumnName("RoleId");
      
      builder.Entity<IdentityUserRole<int>>()
        .ToTable("UserRoles", "auth")
        .HasKey(p => new { p.RoleId, p.UserId });
      
      builder.Entity<IdentityUserClaim<int>>()
        .ToTable("UserClaims", "auth")
        .Property(e => e.Id).HasColumnName("UserClaimId");
      
      builder.Entity<IdentityRoleClaim<int>>()
        .ToTable("RoleClaims", "auth")
        .Property(p => p.Id).HasColumnName("RoleClaimId");
      
      builder.Entity<IdentityUserLogin<int>>()
        .ToTable("UserLogins", "auth")
        .HasKey(p => new { p.LoginProvider, p.ProviderKey });
      
      builder.Entity<IdentityUserToken<int>>()
        .ToTable("UserTokens", "auth")
        .HasKey(p => new { p.UserId, p.LoginProvider, p.Name });
      #endregion
    
    }
  }

  enum ContextType {
    SqlServer,
    Sqlite
  }
}

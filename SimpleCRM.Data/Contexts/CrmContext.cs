using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer.Infrastructure.Internal;
using SimpleCRM.Data.Entities;
using SimpleCRM.Data.Extensions;
using System;

using Action = SimpleCRM.Data.Entities.Action;

namespace SimpleCRM.Data.Contexts {
  public class CrmContext : DbContext {
    readonly ContextType contextType;

    public DbSet<Account> Accounts { get; set; }
    public DbSet<Entity> Entities { get; set; }
    public DbSet<_Label> Labels { get; set; }

    #region Entities
    public DbSet<Action> Actions { get; set; }
    public DbSet<Contact> Contacts { get; set; }
    public DbSet<Company> Companies { get; set; }
    #endregion

    public CrmContext(DbContextOptions<CrmContext> options) : base( options ) {
      contextType = options.FindExtension<SqlServerOptionsExtension>() != null ? 
        ContextType.SqlServer : 
        ContextType.Sqlite;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {

      string defaultNowSql = contextType == ContextType.SqlServer ? "getdate()" : "datetime('now')";
      
      modelBuilder.Entity<_Label>( labelBuilder => {
        labelBuilder.Property( l => l.Created ).HasDefaultValueSql( defaultNowSql );
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
      
      modelBuilder.Entity<Entity>( entityBuilder => {
        entityBuilder.Property( e => e.Created ).HasDefaultValueSql( defaultNowSql );
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

      modelBuilder.Entity<Account>().Property( a => a.Created ).HasDefaultValueSql( defaultNowSql );

      modelBuilder.Entity<Contact>( contactBuilder => {
        contactBuilder.Property( c => c.Created ).HasDefaultValueSql( defaultNowSql );
        var i = 0;
        contactBuilder.HasData(
          new Contact { Id = 1, FirstName = "Angel", LastName = "Muñoz", Created = "16/08/2018 12:30:05.237".ToDateTime() },
          new Contact { Id = 2, FirstName = "Pablo", LastName = "Muñoz", Created = "17/08/2018 09:00:00.000".ToDateTime() },
          new Contact { Id = 3, FirstName = "qrqrg", LastName = "gqzgq", },
          new Contact { Id = 4, FirstName = "sgs", LastName = "rg er g", Created = DateTime.Now.AddMinutes( ++i * -25 ) },
          new Contact { Id = 5, FirstName = "uuj", LastName = "yhy", Created = DateTime.Now.AddMinutes( ++i * -25 ) },
          new Contact { Id = 6, FirstName = "ffdb ", LastName = "dfggg", Created = DateTime.Now.AddMinutes( ++i * -25 ) },
          new Contact { Id = 7, FirstName = "uezbf", LastName = "pzgp", Created = DateTime.Now.AddMinutes( ++i * -25 ) },
          new Contact { Id = 8, FirstName = "test", LastName = "test", Created = DateTime.Now.AddMinutes( ++i * -25 ) },
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

      modelBuilder.Entity<Company>( companyBuilder => {
        companyBuilder.Property( c => c.Created ).HasDefaultValueSql( defaultNowSql );
        companyBuilder.HasData(
          new Company { Id = 1, Name = "Intense Designing", Created = DateTime.Now.AddDays(-3) },
          new Company { Id = 2, Name = "Jin-K Empire" }
        );
      } );

      modelBuilder.Entity<Action>( actionBuilder => {
        actionBuilder.Property( c => c.Created ).HasDefaultValueSql( defaultNowSql );
        actionBuilder.HasData(
          new Action { Id = 1 }
        );
      } );

    }
  }

  enum ContextType {
    SqlServer,
    Sqlite
  }
}

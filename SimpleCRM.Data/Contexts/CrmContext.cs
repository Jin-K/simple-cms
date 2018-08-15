using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer.Infrastructure.Internal;
using SimpleCRM.Data.Entities;
using System;

namespace SimpleCRM.Data.Contexts {
  public class CrmContext : DbContext {

    ContextType contextType;

    public DbSet<Account> Accounts { get; set; }
    public DbSet<Entity> Entities { get; set; }
    public DbSet<_Label> Labels { get; set; }

    #region Entities
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

      modelBuilder.Entity<Contact>().Property( c => c.Created ).HasDefaultValueSql( defaultNowSql );

      modelBuilder.Entity<Company>().Property( c => c.Created ).HasDefaultValueSql( defaultNowSql );

    }
  }

  enum ContextType {
    SqlServer,
    Sqlite
  }
}

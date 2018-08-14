using Microsoft.EntityFrameworkCore;
using SimpleCRM.Api.Models.EF;

namespace SimpleCRM.Api.Providers {
  public class EntitiesContext : DbContext {
    public EntitiesContext(DbContextOptions<EntitiesContext> options) : base( options ) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {

      modelBuilder.Entity<Entity>().HasKey( t => t.Id );
      modelBuilder.Entity<_Label>().HasKey( t => t.Id );

      modelBuilder.Entity<Entity>()
                  .HasOne( e => e.Label )
                  .WithMany( l => l.Entities )
                  .HasForeignKey( e => e.LabelId )
                  .HasConstraintName( "FK_Entities_Labels" )
                  .HasPrincipalKey( t => t.Id );
    }

    public DbSet<Entity> Entities { get; set; }
    public DbSet<_Label> Labels { get; set; }
  }
}

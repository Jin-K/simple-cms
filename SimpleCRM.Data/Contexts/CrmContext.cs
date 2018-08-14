using Microsoft.EntityFrameworkCore;
using SimpleCRM.Data.Entities;

namespace SimpleCRM.Data.Contexts {
  public class CrmContext : DbContext {

    public DbSet<Entity> Entities { get; set; }
    public DbSet<_Label> Labels { get; set; }
    public DbSet<Account> Accounts { get; set; }

    public CrmContext(DbContextOptions<CrmContext> options) : base( options ) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {

      modelBuilder.Entity<Entity>( entityBuilder => {
        //entity.ToTable( "Entities" );
        entityBuilder.HasKey( t => t.Id );
        entityBuilder.HasOne( e => e.Label )
          .WithMany( l => l.Entities )
          .HasForeignKey( e => e.LabelId )
          .HasConstraintName( "FK_Entities_Labels" )
          .HasPrincipalKey( t => t.Id );
      } );
      
      modelBuilder.Entity<_Label>().HasKey( t => t.Id );
      modelBuilder.Entity<Account>().HasKey( t => t.Id );

      base.OnModelCreating( modelBuilder );
    }
  }
}

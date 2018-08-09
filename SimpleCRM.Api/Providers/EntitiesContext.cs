using Microsoft.EntityFrameworkCore;
using SimpleCRM.Api.Models;

namespace SimpleCRM.Api.Providers {
  public class EntitiesContext : DbContext {
    public EntitiesContext(DbContextOptions<EntitiesContext> options) : base( options ) { }
    public DbSet<Entity> Entities { get; set; }
  }
}

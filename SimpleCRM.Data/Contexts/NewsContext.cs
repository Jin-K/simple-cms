using Microsoft.EntityFrameworkCore;
using SimpleCRM.Data.Entities;

namespace SimpleCRM.Data.Contexts {
  public class NewsContext : DbContext {
      public NewsContext(DbContextOptions<NewsContext> options) : base(options) { }

      public DbSet<NewsItemEntity> NewsItemEntities { get; set; }
      
      public DbSet<NewsGroup> NewsGroups { get; set; }
    
  }
}

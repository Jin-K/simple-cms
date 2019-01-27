using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleCMS.Data.Entities {
	public class NewsGroupConfig : IEntityTypeConfiguration<NewsGroup> {
		public void Configure(EntityTypeBuilder<NewsGroup> builder) {
      builder.HasData(
        new NewsGroup { Id = 1,  Name = "are" },
        new NewsGroup { Id = 2,  Name = "IT" },
        new NewsGroup { Id = 3,  Name = "sport" },
        new NewsGroup { Id = 4,  Name = "global" }
      );
		}
	}
}




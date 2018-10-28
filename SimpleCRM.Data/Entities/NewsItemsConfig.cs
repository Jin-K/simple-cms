using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SimpleCRM.Data.Entities;

namespace SimpleCRM.Data.Entities {
  public class NewsItemsConfig : IEntityTypeConfiguration<NewsItemEntity> {
		public void Configure(EntityTypeBuilder<NewsItemEntity> builder) {
      builder.HasData(
        new NewsItemEntity { Id = 1,  Author = "John",    Header = "hi",                      NewsGroup = "are",    NewsText = "1" },
        new NewsItemEntity { Id = 2,  Author = "Tom",     Header = "hi",                      NewsGroup = "are",    NewsText = "2 times" },
        new NewsItemEntity { Id = 3,  Author = "Auz",     Header = "Triller",                 NewsGroup = "are",    NewsText = "night" },
        new NewsItemEntity { Id = 4,  Author = "unknown", Header = 	".NET Core 2.0 released", NewsGroup = "IT",     NewsText = 	":NET Core ha been released" },
        new NewsItemEntity { Id = 5,  Author = "unknown", Header = "Java 9 supports modules", NewsGroup = "IT",     NewsText = "Java 9 has now added support for modules" },
        new NewsItemEntity { Id = 6,  Author = "unknown", Header = 	".NET Core 2.1 release",  NewsGroup = "IT",     NewsText = 	".NET Core 2.1 will support SignalR" },
        new NewsItemEntity { Id = 7,  Author = "unknown", Header = "Brexit means Brexit",     NewsGroup = "global", NewsText = "Whatever that means" },
        new NewsItemEntity { Id = 8,  Author = "unknown", Header = "XMAS is nearly here",     NewsGroup = "global", NewsText = "The XMAS holidays are approaching fast" },
        new NewsItemEntity { Id = 9,  Author = "unknown", Header = "Basel 5:0",               NewsGroup = "sport",  NewsText = "Basel won 5:0 in the Champions league" },
        new NewsItemEntity { Id = 10, Author = "unknown", Header = "wwe",                     NewsGroup = "IT",     NewsText = "ww" },
        new NewsItemEntity { Id = 11, Author = "unknown", Header = "mmm",                     NewsGroup = "IT",     NewsText = "mmm" },
        new NewsItemEntity { Id = 12, Author = "unknown", Header = "que ?",                   NewsGroup = "IT",     NewsText = "testons celà" },
        new NewsItemEntity { Id = 13, Author = "test",    Header = "que ?",                   NewsGroup = "IT",     NewsText = "testons celà" },
        new NewsItemEntity { Id = 14, Author = "test",    Header = "que ?",                   NewsGroup = "sport",  NewsText = "testons celà" },
        new NewsItemEntity { Id = 15, Author = "unknown", Header = "test",                    NewsGroup = "IT",     NewsText = "testteqg" },
        new NewsItemEntity { Id = 16, Author = "unknown", Header = "Jin-K",                   NewsGroup = "sport",  NewsText = "texte" },
        new NewsItemEntity { Id = 17, Author = "unknown", Header = "test",                    NewsGroup = "IT",     NewsText = "testteqg" }
      );
		}
	}
}




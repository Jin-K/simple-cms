using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleCMS.Data.Entities {
	public class WidgetConfig : IEntityTypeConfiguration<Widget> {
		public void Configure(EntityTypeBuilder<Widget> builder) {
			builder.Property( w => w.Created ).HasDefaultValueSql( CmsContext.DefaultNowSql );
      builder.HasData(new Widget { Id = 1 });
		}
	}
}
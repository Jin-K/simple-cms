using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleCRM.Data.Entities {
	public class WidgetConfig : IEntityTypeConfiguration<Widget> {
		public void Configure(EntityTypeBuilder<Widget> builder) {
			builder.Property( w => w.Created ).HasDefaultValueSql( CrmContext.DefaultNowSql );
      builder.HasData(new Widget { Id = 1 });
		}
	}
}
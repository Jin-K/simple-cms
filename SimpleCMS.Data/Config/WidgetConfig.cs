using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SimpleCMS.Data.Entities;

namespace SimpleCMS.Data.Config {

	/// <summary>
	/// The main WidgetConfig class.
	/// Sets default value for Created field and seeds some data
	/// </summary>
	public class WidgetConfig : WithDefaultSqlNowBaseConfig, IEntityTypeConfiguration<Widget> {

		internal WidgetConfig(bool isSqlServer) : base( isSqlServer ) { }

		public void Configure(EntityTypeBuilder<Widget> builder) {

			// set dbo.Widgets.Created's default value to sql NOW value
			builder.Property(w => w.Created).HasDefaultValueSql(DefaultNowSql);

			// seed dbo.Widgets table
			builder.HasData(new Widget { Id = 1 });

		}

	}

}

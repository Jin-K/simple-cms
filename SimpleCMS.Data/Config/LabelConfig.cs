using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SimpleCMS.Data.Entities;

namespace SimpleCMS.Data.Config {

	public class LabelConfig : WithDefaultSqlNowBaseConfig, IEntityTypeConfiguration<_Label> {

		internal LabelConfig(bool isSqlServer) : base( isSqlServer ) {}

		public void Configure(EntityTypeBuilder<_Label> builder) {

			// set dbo.Labels.Created's default value to sql NOW value
			builder.Property( l => l.Created ).HasDefaultValueSql( DefaultNowSql );

			// set dbo.Labels.Custom's default value to 0 (false)
			builder.Property( l => l.Custom ).HasDefaultValueSql( "0" );

			// seed dbo.Labels table
			builder.HasData(
				new _Label { Id = 1, Label = "Sociétés" },
				new _Label { Id = 2, Label = "Contacts" },
				new _Label { Id = 3, Label = "Projets" },
				new _Label { Id = 4, Label = "Documents" },
				new _Label { Id = 5, Label = "Actions" }
			);

		}

	}

}

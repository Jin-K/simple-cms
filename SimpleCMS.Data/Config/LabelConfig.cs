using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SimpleCMS.Data.Entities;

namespace SimpleCMS.Data.Config {

	public class LabelConfig : WithDefaultSqlNowBaseConfig, IEntityTypeConfiguration<Label_> {

		internal LabelConfig(bool isSqlServer) : base( isSqlServer ) {}

		public void Configure(EntityTypeBuilder<Label_> builder) {

			// set dbo.Labels.Created's default value to sql NOW value
			builder.Property( l => l.Created ).HasDefaultValueSql( DefaultNowSql );

			// set dbo.Labels.Custom's default value to 0 (false)
			builder.Property( l => l.Custom ).HasDefaultValueSql( "0" );

			// seed dbo.Labels table
			builder.HasData(
				new Label_ { Id = 1, Label = "Sociétés" },
				new Label_ { Id = 2, Label = "Contacts" },
				new Label_ { Id = 3, Label = "Projets" },
				new Label_ { Id = 4, Label = "Documents" },
				new Label_ { Id = 5, Label = "Actions" }
			);

		}

	}

}

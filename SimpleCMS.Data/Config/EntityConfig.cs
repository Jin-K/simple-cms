using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SimpleCMS.Data.Entities;

namespace SimpleCMS.Data.Config {

	/// <summary>
	/// The main EntityConfig class
	/// </summary>
	public class EntityConfig : WithDefaultSqlNowBaseConfig, IEntityTypeConfiguration<Entity> {

		/// <summary>
		/// Constructor
		/// </summary>
		/// <param name="isSqlServer"></param>
		internal EntityConfig(bool isSqlServer) : base( isSqlServer ) { }

		/// <summary>
		/// The main Configure method
		/// </summary>
		/// <param name="builder"></param>
		public void Configure(EntityTypeBuilder<Entity> builder) {

			// set dbo.Entities.Created's default value to sql NOW value
			builder.Property( e => e.Created ).HasDefaultValueSql( DefaultNowSql );

			// set dbo.Entities.Custom's default value to 0 (false)
			builder.Property( e => e.Custom ).HasDefaultValueSql( "0" );

			// seed dbo.Entities table
			builder.HasData(
				new Entity { Id = 10, Name = "Companies", LabelId = 1 },
				new Entity { Id = 11, Name = "Contacts", LabelId = 2 },
				new Entity { Id = 20, Name = "Projects", LabelId = 3 },
				new Entity { Id = 31, Name = "Documents", LabelId = 4 },
				new Entity { Id = 32, Name = "Actions", LabelId = 5 }
			);

		}

	}

}

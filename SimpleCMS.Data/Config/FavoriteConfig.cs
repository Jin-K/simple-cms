using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SimpleCMS.Data.Entities;

namespace SimpleCMS.Data.Config {

	/// <summary>
	/// The main FavoriteConfig class
	/// </summary>
	class FavoriteConfig : WithDefaultSqlNowBaseConfig, IEntityTypeConfiguration<Favorite> {

		/// <summary>
		/// Constructor
		/// </summary>
		/// <param name="isSqlServer"></param>
		internal FavoriteConfig(bool isSqlServer) : base( isSqlServer ) { }

		/// <summary>
		/// The main Configure method
		/// </summary>
		/// <param name="builder">default builder object for Widgets set</param>
		/// <inheritdoc />
		public void Configure(EntityTypeBuilder<Favorite> builder) {

			// clustered primary key
			builder.HasKey( c => new { c.UserId, c.EntityId, c.ItemId } );

			// set dbo.Favorites.Created's default value to sql NOW value
			builder.Property( f => f.Created ).HasDefaultValueSql( DefaultNowSql );

			// seed dbo.Favorites table
			builder.HasData(
				new Favorite( 1, 11, 1 ),
				new Favorite( 1, 11, 3 ),
				new Favorite( 1, 11, 7 ),
				new Favorite( 1, 11, 11 ),
				new Favorite( 1, 11, 16 ),
				new Favorite( 1, 10, 2 ),
				new Favorite( 1, 32, 1 )
			);

		}

	}

}

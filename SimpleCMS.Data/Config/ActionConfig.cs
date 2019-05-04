using GenFu;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SimpleCMS.Data.Entities;

namespace SimpleCMS.Data.Config {

	/// <summary>
	/// The main ActionConfig class
	/// </summary>
	public class ActionConfig : WithDefaultSqlNowBaseConfig, IEntityTypeConfiguration<Action> {

		/// <summary>
		/// Constructor
		/// </summary>
		/// <param name="isSqlServer"></param>
		internal ActionConfig(bool isSqlServer) : base( isSqlServer ) { }

		/// <summary>
		/// The main Configure method
		/// </summary>
		/// <param name="builder"></param>
		public void Configure(EntityTypeBuilder<Action> builder) {

			// set dbo.Actions.Created's default value to sql NOW value
			builder.Property( c => c.Created ).HasDefaultValueSql( DefaultNowSql );

			// prepare list of random actions
			var actionsToSeed = A.ListOf<Action>( 3 );
			var i = 0;
			actionsToSeed.ForEach( a => a.Id = ++i );

			// seed dbo.Actions table
			builder.HasData( actionsToSeed );

		}

	}

}

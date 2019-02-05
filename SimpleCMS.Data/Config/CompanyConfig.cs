using GenFu;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SimpleCMS.Data.Entities;

namespace SimpleCMS.Data.Config {

	/// <summary>
	/// The main CompanyConfig class
	/// </summary>
	public class CompanyConfig : StringConversionConfigBase, IEntityTypeConfiguration<Company> {

		/// <summary>
		/// Constructor
		/// </summary>
		/// <param name="isSqlServer"></param>
		public CompanyConfig(bool isSqlServer) : base( isSqlServer ) { }

		public void Configure(EntityTypeBuilder<Company> builder) {

			// set dbo.Companies.Created's default value to sql NOW value
			builder.Property( c => c.Created ).HasDefaultValueSql( DefaultNowSql );

			// inform EF core that some properties need CLR conversion (using aosToSConverter)
			builder.Property( c => c.Phones ).HasConversion( AosToSConverter );
			builder.Property( c => c.Faxes ).HasConversion( AosToSConverter );
			builder.Property( c => c.Websites ).HasConversion( AosToSConverter );
			builder.Property( c => c.Emails ).HasConversion( AosToSConverter );

			// seed dbo.Companies table
			var i = 0;
			var companiesToSeed = A.ListOf<Company>( 2 );
			companiesToSeed.ForEach( c => c.Id = ++i );
			builder.HasData( companiesToSeed );

		}

	}

}

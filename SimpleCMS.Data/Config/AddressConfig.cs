using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SimpleCMS.Data.Entities;

namespace SimpleCMS.Data.Config {

	/// <summary>
	/// The main AddressConfig class
	/// </summary>
	public class AddressConfig : WithDefaultSqlNowBaseConfig, IEntityTypeConfiguration<Address> {

		/// <summary>
		/// Constructor
		/// </summary>
		/// <param name="isSqlServer"></param>
		internal AddressConfig(bool isSqlServer) : base( isSqlServer ) { }

		/// <summary>
		/// The main Configure method
		/// </summary>
		/// <param name="builder"></param>
		public void Configure(EntityTypeBuilder<Address> builder) {

			// set dbo.Addresses.Created's default value to sql NOW value
			builder.Property( c => c.Created ).HasDefaultValueSql( DefaultNowSql );

			// seed dbo.Addresses table
			builder.Property( c => c.Main ).HasDefaultValue( false );
			builder.HasData(
				new Address { Id = 1, ContactId = 1, Street = "Avenue des Arts", Number = "4", Zip = "1040", City = "Brussels", Country = "BE" },
				new Address { Id = 2, Name = "Planque", Main = true, ContactId = 1, Street = "Rue d'en dessous", Number = "11", Zip = "75000", City = "Paris", Country = "FR" },
				new Address { Id = 3, Main = true, ContactId = 2, Street = "Chaussée des délires", Number = "357", Zip = "1337", City = "South Park", Country = "BE" },
				new Address { Id = 4, Name = "QG", Main = true, CompanyId = 2, Street = "Place de la duchesse", Zip = "1080", City = "Brussels", Country = "BE" }
			);

		}

	}

}

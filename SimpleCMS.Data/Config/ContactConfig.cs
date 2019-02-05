using System;
using GenFu;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SimpleCMS.Data.Entities;
using SimpleCMS.Data.Extensions;

namespace SimpleCMS.Data.Config {

	public class ContactConfig : StringConversionConfigBase, IEntityTypeConfiguration<Contact> {

		/// <summary>
		/// Constructor
		/// </summary>
		/// <param name="isSqlServer"></param>
		public ContactConfig(bool isSqlServer) : base( isSqlServer ) { }

		/// <summary>
		/// The main Configure method
		/// </summary>
		/// <param name="builder"></param>
		public void Configure(EntityTypeBuilder<Contact> builder) {

			// set dbo.Contacts.Created's default value to sql NOW value
			builder.Property( c => c.Created ).HasDefaultValueSql( DefaultNowSql );

			// inform EF core that some properties need CLR conversion (using aosToSConverter)
			builder.Property( c => c.Phones ).HasConversion( AosToSConverter );
			builder.Property( c => c.Faxes ).HasConversion( AosToSConverter );
			builder.Property( c => c.Websites ).HasConversion( AosToSConverter );
			builder.Property( c => c.Emails ).HasConversion( AosToSConverter );

			// seed dbo.Contacts table
			var i = 0;
			var contactsToSeed = A.ListOf<Contact>( 17 );
			contactsToSeed.ForEach( x => {
				x.Id = ++i;
				x.Created = i == 1 ?
					"16/08/2018 12:30:05.237".ToDateTime() :
					i == 2 ?
						"17/08/2018 09:00:00.000".ToDateTime() :
						DateTime.Now.AddMinutes( i * -25 );
			} );
			builder.HasData( contactsToSeed );

		}

	}

}

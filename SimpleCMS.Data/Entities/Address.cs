using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SimpleCMS.Data.Entities {

	/// <summary>
	/// Addresses table definition
	/// -------------------------------------
	/// Addresses  1 <>---<> 0..*  Contacts
	/// Addresses  1 <>---<> 0..*  Companies
	/// -------------------------------------
	/// </summary>
	[Table( "Addresses" )]
	public class Address {

		[Required, Key, DatabaseGenerated( DatabaseGeneratedOption.Identity )]
		public int Id { get; set; }

		public string Name { get; set; }

		public bool Main { get; set; }

		[Required]
		public DateTime Created { get; set; } = DateTime.Now;

		public DateTime Updated { get; set; }

		public string Street { get; set; }

		public string Number { get; set; }

		public string Box { get; set; }

		public string Zip { get; set; }

		public string City { get; set; }

		public string Country { get; set; }

		public int? ContactId { get; set; }

		public int? CompanyId { get; set; }


		[ForeignKey( "ContactId" )]
		[InverseProperty( "Addresses" )]
		public Contact Contact { get; set; }


		[ForeignKey( "CompanyId" )]
		[InverseProperty( "Addresses" )]
		public Company Company { get; set; }

	}
}
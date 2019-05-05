using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SimpleCMS.Data.Entities {

	public class Company : IEntity {

		[Key]
		public int Id { get; set; }

		public bool Active { get; set; } = true;

		public string Name { get; set; }

		[Required]
		public DateTime Created { get; set; } = DateTime.Now;

		public DateTime? Updated { get; set; }

		public string Description { get; set; }

		public string[] Phones { get; set; }

		public string[] Faxes { get; set; }

		public string[] Websites { get; set; }

		public string[] Emails { get; set; }

		public string Picture { get; set; }

		public string Facebook { get; set; }

		public string Twitter { get; set; }

		[InverseProperty( "Company" )]
		public ICollection<Address> Addresses { get; set; }

	}
}

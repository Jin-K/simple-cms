using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace SimpleCMS.Data.Entities {

	public class AppUser : IdentityUser<int> {

		public bool IsAdmin { get; set; }

		public string DataEventRecordsRole { get; set; }

		public string SecuredFilesRole { get; set; }

		[InverseProperty( "User" )]
		public ICollection<Favorite> Favorites { get; set; }
	}

}

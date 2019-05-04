using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleCMS.Data.Config {

	public class IdentityUserLoginConfig : IEntityTypeConfiguration<IdentityUserLogin<int>> {

		public void Configure(EntityTypeBuilder<IdentityUserLogin<int>> builder)
			=> builder.ToTable( "UserLogins", "auth" )
				.HasKey( p => new { p.LoginProvider, p.ProviderKey } );

	}

}

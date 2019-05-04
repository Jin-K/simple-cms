using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleCMS.Data.Config {

	public class IdentityRoleClaimConfig : IEntityTypeConfiguration<IdentityRoleClaim<int>> {

		public void Configure(EntityTypeBuilder<IdentityRoleClaim<int>> builder)
			=> builder.ToTable( "RoleClaims", "auth" )
				.Property( p => p.Id ).HasColumnName( "RoleClaimId" );

	}

}

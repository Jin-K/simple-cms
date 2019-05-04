using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleCMS.Data.Config {

	public class IdentityUserRoleConfig : IEntityTypeConfiguration<IdentityUserRole<int>> {

		public void Configure(EntityTypeBuilder<IdentityUserRole<int>> builder)
			=> builder.ToTable( "UserRoles", "auth" )
				.HasKey( p => new { p.RoleId, p.UserId } );

	}

}

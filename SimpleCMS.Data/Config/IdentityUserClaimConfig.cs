using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleCMS.Data.Config {

	public class IdentityUserClaimConfig : IEntityTypeConfiguration<IdentityUserClaim<int>> {

		public void Configure(EntityTypeBuilder<IdentityUserClaim<int>> builder)
			=> builder.ToTable( "UserClaims", "auth" )
				.Property( e => e.Id ).HasColumnName( "UserClaimId" );

	}

}

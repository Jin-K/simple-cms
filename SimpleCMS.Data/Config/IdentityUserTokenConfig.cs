using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleCMS.Data.Config {

	public class IdentityUserTokenConfig : IEntityTypeConfiguration<IdentityUserToken<int>> {

		public void Configure(EntityTypeBuilder<IdentityUserToken<int>> builder)
			=> builder.ToTable("UserTokens", "auth")
				.HasKey(p => new {p.UserId, p.LoginProvider, p.Name});

	}

}

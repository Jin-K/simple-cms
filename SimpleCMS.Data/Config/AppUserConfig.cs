using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SimpleCMS.Data.Entities;

namespace SimpleCMS.Data.Config {

	public class AppUserConfig : IEntityTypeConfiguration<AppUser> {

		public void Configure(EntityTypeBuilder<AppUser> builder) {

			// rename table as dbo.Users
			builder.ToTable( "Users" );

			// rename Id column as dbo.Users.UserId
			builder.Property( p => p.Id ).HasColumnName( "UserId" );

			// create default test user
			builder.HasData( new AppUser {
				Id = 1,
				AccessFailedCount = 0,
				ConcurrencyStamp = "fe80632a-a20f-4510-9237-205ebab34516",
				Email = "test@test.com",
				EmailConfirmed = false,
				IsAdmin = false,
				DataEventRecordsRole = null,
				SecuredFilesRole = null,
				LockoutEnabled = true,
				LockoutEnd = null,
				NormalizedEmail = "TEST@TEST.COM",
				NormalizedUserName = "TEST@TEST.COM",
				PasswordHash = "AQAAAAEAACcQAAAAEEh1H8KfznRWQglPFMBIyzLo4AevzKuZYHJq+1vw6sZsvJQgbiIIJYJaTtXg0e3l7A==",
				PhoneNumber = null,
				PhoneNumberConfirmed = false,
				SecurityStamp = "LFEFYRS5H6M3M7QURCCLH76HKHPWXQHZ",
				TwoFactorEnabled = false,
				UserName = "test@test.com"
			} );

		}

	}

}

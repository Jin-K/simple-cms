using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SimpleCMS.Data.Entities;

namespace SimpleCMS.Data.Config {

	public class AppRoleConfig : IEntityTypeConfiguration<AppRole> {

		public void Configure(EntityTypeBuilder<AppRole> builder)
			=> builder.ToTable("Roles").Property(p => p.Id).HasColumnName("RoleId");

	}

}

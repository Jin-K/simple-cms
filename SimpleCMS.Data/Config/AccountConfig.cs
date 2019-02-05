using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SimpleCMS.Data.Entities;

namespace SimpleCMS.Data.Config {

	public class AccountConfig : WithDefaultSqlNowBaseConfig, IEntityTypeConfiguration<Account> {

		internal AccountConfig(bool isSqlServer) : base(isSqlServer) { }

		public void Configure(EntityTypeBuilder<Account> builder)
			=> builder.Property(a => a.Created).HasDefaultValueSql( DefaultNowSql );

	}

}

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleCMS.Data.Entities {

	/// <summary>
	/// The main WidgetCongif class.
	/// Sets default value for Created field and seeds some data
	/// </summary>
	/// <typeparam name="Widget"></typeparam>
	public class WidgetConfig : IEntityTypeConfiguration<Widget> {

		/// <summary>
		/// The main Configure method (implementing <see cref="IEntityTypeConfiguration.Configure(EntityTypeBuilder{TEntity})" />)
		/// </summary>
		/// <param name="builder">default builder object for Widgets set</param>
		public void Configure(EntityTypeBuilder<Widget> builder) {

			// set dbo.Widgets.Created's default value to sql NOW value
			builder.Property(w => w.Created).HasDefaultValueSql(CmsContext.DefaultNowSql);

			// seed dbo.Widgets table
			builder.HasData(new Widget { Id = 1 });

		}

	}

}

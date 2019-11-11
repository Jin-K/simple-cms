using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;
using System.Reflection;

namespace SimpleCMS.Data {

	/// <summary>
	/// Base class for temporary classes implementing <see cref="IDesignTimeDbContextFactory{TContext}"/>.
	/// </summary>
	/// <typeparam name="TContext">The type inheriting from <see cref="DbContext"/>.</typeparam>
	public abstract class DesignTimeDbContextFactory<TContext> : IDesignTimeDbContextFactory<TContext> where TContext : DbContext {

		/// <summary>
		/// The SQL connection string.
		/// </summary>
		protected readonly string ConnectionString = "Host=localhost;Username=gitpod;Database=simple-cms";

		/// <summary>
		/// The assembly name where all our custom <see cref="DbContext"/> derived types are defined.
		/// </summary>
		protected readonly string AssemblyName = typeof(CmsContext).GetTypeInfo().Assembly.GetName().Name;

		/// <summary>
		/// Flag indicating if the <see cref="DbContextOptions{TContext}"/> object should be created in the <see cref="DesignTimeDbContextFactory{TContext}.CreateDbContext"/> method or not.
		/// </summary>
		protected abstract bool CreateDbOptionsBuilder { get; }

		/// <summary>
		/// Creates a new instance of a derived context.
		/// </summary>
		/// <param name="args"> Arguments provided by the design-time service. </param>
		/// <returns> An instance of <typeparamref name="TContext" />. </returns>
		public TContext CreateDbContext(string[] args) {
			if (!CreateDbOptionsBuilder) return CreateInstance();

			var builder = new DbContextOptionsBuilder<TContext>();
			builder.UseNpgsql( ConnectionString, b => b.MigrationsAssembly( AssemblyName ) );
			return CreateInstance( builder.Options );
		}

		/// <summary>
		/// Abstract method to let derived classes finalize the <typeparamref name="TContext" /> creation by their own.
		/// </summary>
		/// <param name="builderOptions">The optional builder options.</param>
		/// <returns>An instance of <typeparamref name="TContext" />.</returns>
		protected abstract TContext CreateInstance(DbContextOptions<TContext> builderOptions = null);

	}

	/// <summary>
	/// The main TemporaryCmsContext class.
	/// </summary>
	public class TemporaryCmsContext : DesignTimeDbContextFactory<CmsContext> {

		/// <summary>
		/// Flag indicating if the <see cref="DbContextOptions{TContext}"/> object should be created in the <see cref="DesignTimeDbContextFactory{TContext}.CreateDbContext"/> method or not.
		/// </summary>
		protected override bool CreateDbOptionsBuilder => true;

		/// <summary>
		/// Implementation of abstract <see cref="DesignTimeDbContextFactory{TContext}.CreateInstance"/> method.
		/// </summary>
		/// <param name="builderOptions">The optional builder options.</param>
		/// <returns>An instance of <see cref="CmsContext"/>.</returns>
		protected override CmsContext CreateInstance(DbContextOptions<CmsContext> builderOptions = null)
			=> new CmsContext( builderOptions );

	}

	/// <summary>
	/// The main TemporaryPersistedGrantDbContext class.
	/// </summary>
	public class TemporaryPersistedGrantDbContext : DesignTimeDbContextFactory<PersistedGrantDbContext> {

		/// <summary>
		/// Flag indicating if the <see cref="DbContextOptions{TContext}"/> object should be created in the <see cref="DesignTimeDbContextFactory{TContext}.CreateDbContext"/> method or not.
		/// </summary>
		protected override bool CreateDbOptionsBuilder => true;

		/// <summary>
		/// Implementation of abstract <see cref="DesignTimeDbContextFactory{TContext}.CreateInstance"/> method.
		/// </summary>
		/// <param name="builderOptions">The optional builder options.</param>
		/// <returns>An instance of <see cref="PersistedGrantDbContext"/>.</returns>
		protected override PersistedGrantDbContext CreateInstance(DbContextOptions<PersistedGrantDbContext> builderOptions = null) {
			var opOptions = new OperationalStoreOptions { DefaultSchema = "auth" };
			return new PersistedGrantDbContext( builderOptions, opOptions );
		}

	}

	/// <summary>
	/// The main TemporaryConfigurationDbContext class.
	/// </summary>
	public class TemporaryConfigurationDbContext : DesignTimeDbContextFactory<CustomConfigurationDbContext> {

		/// <summary>
		/// Flag indicating if the <see cref="DbContextOptions{TContext}"/> object should be created in the <see cref="DesignTimeDbContextFactory{TContext}.CreateDbContext"/> method or not.
		/// </summary>
		protected override bool CreateDbOptionsBuilder => false;

		/// <summary>
		/// Implementation of abstract <see cref="DesignTimeDbContextFactory{TContext}.CreateInstance"/> method.
		/// </summary>
		/// <param name="builderOptions">The optional builder options.</param>
		/// <returns>An instance of <see cref="CustomConfigurationDbContext"/>.</returns>
		protected override CustomConfigurationDbContext CreateInstance(DbContextOptions<CustomConfigurationDbContext> builderOptions = null) {
			var builder = new DbContextOptionsBuilder<ConfigurationDbContext>();
			builder.UseNpgsql( ConnectionString, b => b.MigrationsAssembly( AssemblyName ) );
			var storeOptions = new ConfigurationStoreOptions { DefaultSchema = "auth" };
			return new CustomConfigurationDbContext( builder.Options, storeOptions );
		}

	}

}

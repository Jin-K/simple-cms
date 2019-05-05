using System;

namespace SimpleCMS.Domain.Interfaces {

	/// <summary>
	/// The <see cref="IUnitOfWork"/> interface
	/// </summary>
	public interface IUnitOfWork : IDisposable {

		/// <summary>
		/// Gets a generic repository.
		/// </summary>
		/// <typeparam name="TEntity">Type of the repository's entity.</typeparam>
		/// <returns>The generic repository.</returns>
		IRepository<TEntity> Repository<TEntity>() where TEntity : class;

		/// <summary>
		/// Save changes in database.
		/// </summary>
		/// <returns>The total of affected rows.</returns>
		int Commit();

	}

}
using Microsoft.EntityFrameworkCore;
using SimpleCMS.Data.Repositories;
using SimpleCMS.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SimpleCMS.Data {

	/// <summary>
	/// The main <see cref="UnitOfWork"/> class.
	/// </summary>
	class UnitOfWork : IUnitOfWork {

		/// <summary>
		/// The main <see cref="DbContext"/> instance for the application.
		/// </summary>
		private readonly DbContext _context;

		/// <summary>
		/// Internal store containing all invoked generic repositories.
		/// </summary>
		private readonly Dictionary<Type, object> _repositories = new Dictionary<Type, object>();

		/// <summary>
		/// Initializes a new instance of <see cref="UnitOfWork"/>.
		/// </summary>
		public UnitOfWork() => _context = new CmsContext();

		/// <inheritdoc />
		/// <summary>
		/// Gets a generic repository.
		/// </summary>
		/// <typeparam name="TEntity">Type of the repository's entity.</typeparam>
		/// <returns>The generic repository.</returns>
		public IRepository<TEntity> Repository<TEntity>() where TEntity : class {
			if (_repositories.Keys.Contains( typeof( TEntity ) ))
				return _repositories[typeof( TEntity )] as IRepository<TEntity>;

			IRepository<TEntity> repo = new Repository<TEntity>( _context );
			_repositories.Add( typeof( TEntity ), repo );
			return repo;
		}

		/// <inheritdoc />
		/// <summary>
		/// Save changes in database.
		/// </summary>
		/// <returns>The total of affected rows.</returns>
		public int Commit() => _context.SaveChanges();

		/// <summary>
		/// Dispose the <see cref="UnitOfWork"/> instance.
		/// </summary>
		public void Dispose() {
			Dispose( true );
			GC.SuppressFinalize( this );
		}

		/// <summary>
		/// Dispose the <see cref="DbContext"/> instance, can be overriden.
		/// </summary>
		/// <param name="disposing">The disposing state.</param>
		protected virtual void Dispose(bool disposing) {
			if (!disposing) return;
			_context.Dispose();
		}

	}

}

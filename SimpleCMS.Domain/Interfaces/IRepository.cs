using System;
using System.Collections.Generic;
using System.Linq;

namespace SimpleCMS.Domain.Interfaces {

	/// <summary>
	/// The generic <see cref="IRepository{TEntity}"/> interface.
	/// </summary>
	/// <typeparam name="TEntity"></typeparam>
	public interface IRepository<TEntity> where TEntity : class {

		/// <summary>
		/// Add an entity.
		/// </summary>
		/// <param name="entity">The entity instance.</param>
		void Add(TEntity entity);

		/// <summary>
		/// Attach an entity.
		/// </summary>
		/// <param name="entity">The entity instance.</param>
		void Attach(TEntity entity);

		/// <summary>
		/// Find in the set (and query it) to get filtered results.
		/// </summary>
		/// <param name="predicate">The filtering predicate.</param>
		/// <returns>A queryable set.</returns>
		IQueryable<TEntity> Find(Func<TEntity, bool> predicate);

		/// <summary>
		/// Get an entity by its primary key.
		/// </summary>
		/// <param name="id">Primary key.</param>
		/// <returns>The found entity.</returns>
		TEntity Get(int id);

		/// <summary>
		/// Get the first entity matching to a filtering predicate.
		/// </summary>
		/// <param name="predicate">The filtering predicate.</param>
		/// <returns>The found entity.</returns>
		TEntity Get(Func<TEntity, bool> predicate);

		/// <summary>
		/// Get all the entities or a filtered set if <paramref name="predicate"/> is defined.
		/// </summary>
		/// <param name="predicate">The filtering predicate.</param>
		/// <returns>An enumerable of all the entities or all filtered results.</returns>
		IEnumerable<TEntity> GetAll(Func<TEntity, bool> predicate = null);

		/// <summary>
		/// Remove an entity.
		/// </summary>
		/// <param name="entity">The entity instance.</param>
		void Remove(TEntity entity);

		/// <summary>
		/// Update an entity.
		/// </summary>
		/// <param name="entity">The entity instance.</param>
		void Update(TEntity entity);

	}

}

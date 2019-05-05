using Microsoft.EntityFrameworkCore;
using SimpleCMS.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SimpleCMS.Data.Repositories {

	/// <summary>
	/// The generic repository base class.
	/// </summary>
	public class Repository<TEntity> : IRepository<TEntity> where TEntity : class {

		/// <summary>
		/// The generic <see cref="DbSet{TEntity}"/> for the repository.
		/// </summary>
		readonly DbSet<TEntity> _objectSet;

		/// <summary>
		/// Initializes a new instance of <see cref="Repository{TEntity}"/>.
		/// </summary>
		/// <param name="context">The database context.</param>
		public Repository(DbContext context) => _objectSet = context.Set<TEntity>();

		/// <inheritdoc />
		/// <summary>
		/// Add an entity.
		/// </summary>
		/// <param name="entity">The entity instance.</param>
		public void Add(TEntity entity)
			=> _objectSet.Add( entity );

		/// <inheritdoc />
		/// <summary>
		/// Attach an entity.
		/// </summary>
		/// <param name="entity">The entity instance.</param>
		public void Attach(TEntity entity)
			=> _objectSet.Attach( entity );

		/// <inheritdoc />
		/// <summary>
		/// Find in the set (and query it) to get filtered results.
		/// </summary>
		/// <param name="predicate">The filtering predicate.</param>
		/// <returns>A queryable set.</returns>
		public IQueryable<TEntity> Find(Func<TEntity, bool> predicate)
			=> _objectSet.Where( predicate ).AsQueryable();

		/// <inheritdoc />
		/// <summary>
		/// Get an entity by its primary key.
		/// </summary>
		/// <param name="id">Primary key.</param>
		/// <returns>The found entity.</returns>
		public TEntity Get(int id)
			=> _objectSet.Find( id );

		/// <inheritdoc />
		/// <summary>
		/// Get the first entity matching to a filtering predicate.
		/// </summary>
		/// <param name="predicate">The filtering predicate.</param>
		/// <returns>The found entity.</returns>
		public TEntity Get(Func<TEntity, bool> predicate)
			=> _objectSet.First( predicate );

		/// <inheritdoc />
		/// <summary>
		/// Get all the entities or a filtered set if <paramref name="predicate"/> is defined.
		/// </summary>
		/// <param name="predicate">The filtering predicate.</param>
		/// <returns>An enumerable of all the entities or all filtered results.</returns>
		public IEnumerable<TEntity> GetAll(Func<TEntity, bool> predicate = null)
			=> predicate == null ? _objectSet.AsEnumerable() : _objectSet.Where( predicate ).AsEnumerable();

		/// <inheritdoc />
		/// <summary>
		/// Remove an entity.
		/// </summary>
		/// <param name="entity">The entity instance.</param>
		public void Remove(TEntity entity)
			=> _objectSet.Remove(entity);

		/// <inheritdoc />
		/// <summary>
		/// Update an entity.
		/// </summary>
		/// <param name="entity">The entity instance.</param>
		public void Update(TEntity entity)
			=> _objectSet.Update(entity);

	}

}

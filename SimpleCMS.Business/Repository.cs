using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using SimpleCMS.Data;

namespace SimpleCMS.Business {

	/// <summary>
	/// The generic repository base class.
	/// </summary>
	public class Repository<T> where T : class {

		readonly DbSet<T> _objectSet;

		public Repository(CmsContext context) => _objectSet = context.Set<T>();

		public void Add(T entity)
			=> _objectSet.Add( entity );

		public void Attach(T entity)
			=> _objectSet.Attach( entity );

		public IQueryable<T> Find(Func<T, bool> predicate)
			=> _objectSet.Where( predicate ).AsQueryable();

		public T Get(int id)
			=> _objectSet.Find( id );

		public T Get(Func<T, bool> predicate)
			=> _objectSet.First( predicate );

		public IEnumerable<T> GetAll(Func<T, bool> predicate = null)
			=> predicate == null ? _objectSet.AsEnumerable() : _objectSet.Where( predicate ).AsEnumerable();

		public void Remove(T entity)
			=> _objectSet.Remove(entity);

		public void Update(T entity)
			=> _objectSet.Update(entity);

	}

}

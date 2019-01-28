using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SimpleCMS.Business.Models;
using SimpleCMS.Data;
using SimpleCMS.Data.Entities;

namespace SimpleCMS.Business.Providers {

	/// <summary>
	/// The main MainStore class.
	/// Provides methods to access main sets of cms
	/// </summary>
	public class MainStore : IMainStore {

		/// <summary>
		/// CmsContext's instance.
		/// 
		/// <seealso cref="MainStore(CmsContext)" />
		/// </summary>
		private readonly CmsContext _context;

		/// <summary>
		/// Constructor
		/// </summary>
		/// <param name="context">main database context of simple-cms</param>
		public MainStore(CmsContext context)
		=> this._context = context;

		/// <summary>
		/// Gets all accounts (cms accounts, not identity accounts)
		/// </summary>
		/// <returns>Returns all cms accounts</returns>
		public Task<List<Account>> GetAllAccounts()
		=> this._context.Accounts.ToListAsync();

		/// <summary>
		/// Gets all main entities
		/// </summary>
		/// <returns>Returns all main entities as a generic list of <see cref="Entidad" /></returns>
		public Task<List<Entity>> GetAllEntities()
		=> this._context.Entities.ToListAsync();

	}

}

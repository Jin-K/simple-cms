using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SimpleCMS.Data;
using SimpleCMS.Data.Entities;

namespace SimpleCMS.Business.Providers {

	/// <summary>
	/// The main MiscStore class.
	/// Provides methods to access other sets, misc tables, etc.
	/// </summary>
	public class MiscStore : IMiscStore {

		/// <summary>
		/// CmsContext's instance
		/// 
		/// <seealso cref="MiscStore(CmsContext)" />
		/// </summary>
		private readonly CmsContext _context;

		/// <summary>
		/// Constructor
		/// </summary>
		/// <param name="context">main database context of simple-cms</param>
		public MiscStore(CmsContext context)
		=> this._context = context;

		/// <summary>
		/// Get all addresses in database
		/// </summary>
		/// <returns>Returns a generic list of addresses asynchronously</returns>
		public Task<List<Address>> GetAllAddresses()
		=> this._context.Addresses.ToListAsync();

		/// <summary>
		/// Gets all favorites in database
		/// </summary>
		/// <returns>Returns a generic list of favorites asynchronously</returns>
		public Task<List<Favorite>> GetAllFavorites()
		=> this._context.Favorites.ToListAsync();

		/// <summary>
		/// Gets all labels in database
		/// </summary>
		/// <returns>Returns a generic list of labels asynchronously</returns>
		public Task<List<_Label>> GetAllLabels()
		=> this._context.Labels.ToListAsync();

		/// <summary>
		/// Gets all news groups in database
		/// </summary>
		/// <returns>Returns a generic list of news groups asynchronously</returns>
		public Task<List<NewsGroup>> GetAllNewsGroups()
		=> this._context.NewsGroups.ToListAsync();

		/// <summary>
		/// Gets all news item entities in database
		/// </summary>
		/// <returns>Returns a generic list of news item entities asynchronously</returns>
		public Task<List<NewsItemEntity>> GetAllNewsItemEntities()
		=> this._context.NewsItemEntities.ToListAsync();

		/// <summary>
		/// Gets all widgets in database
		/// </summary>
		/// <returns>Returns a generic list of widgets asynchronously</returns>
		public Task<List<Widget>> GetAllWidgets()
		=> this._context.Widgets.ToListAsync();

	}

}

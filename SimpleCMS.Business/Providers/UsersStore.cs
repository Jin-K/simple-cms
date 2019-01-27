using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using SimpleCMS.Data;
using SimpleCMS.Data.Entities;

namespace SimpleCMS.Business.Providers {

	public class UsersStore {

    /// <summary>
    /// CmsContext's instance.
    /// </summary>
    readonly CmsContext _cmsContext;

		/// <summary>
		/// Constructor
		/// </summary>
		/// <remarks>
		/// Sets <see cref="_cmsContext" /> via DI
		/// </remarks>
		/// <param name="cmsContext">main database context of simple-cms</param>
		public UsersStore(CmsContext cmsContext) => _cmsContext = cmsContext;

    /// <summary>
    /// Creates a row if not exists in dbo.Favorites table
    /// </summary>
    /// <param name="userId">user id</param>
    /// <param name="entity">entity name</param>
    /// <param name="itemId">entity item id</param>
    /// <returns>true if no errors</returns>
    public bool CreateFavorite(int userId, string entity, int itemId) {
      
      // get entityId
      var entityId = _cmsContext.Entities.SingleOrDefault( e => e.Name == entity )?.Id ?? 0;

      // prepare favorite row
      var toAdd = new Favorite(userId, entityId, itemId);

      // add to favorites
      _cmsContext.Favorites.Add(toAdd);

      try {
        // save
        _cmsContext.SaveChanges();
      }
      catch (DbUpdateConcurrencyException) {
        // rethrow
        throw;
      }
      catch (DbUpdateException) {
        // if foreign key constraints the most times
        return false;
      }

      // if ok
      return true;

    }

    /// <summary>
    /// Deletes a row if exists in dbo.Favorites table
    /// </summary>
    /// <param name="userId">user id</param>
    /// <param name="entity">entity name</param>
    /// <param name="itemId">entity item id</param>
    /// <returns>true if no errors</returns>
    public bool DeleteFavorite(int userId, string entity, int itemId) {

      // get entityId
      var entityId = _cmsContext.Entities.SingleOrDefault( e => e.Name == entity )?.Id ?? 0;

      // prepare favorite item for supression
      var toRemove = new Favorite(userId, entityId, itemId);

      // remove from favorites
      _cmsContext.Favorites.Remove(toRemove);

      try {
        // save changes
        _cmsContext.SaveChanges();
      }
      catch (DbUpdateConcurrencyException) {
        // rethrow
        throw;
      }
      catch (DbUpdateException) {
        // if foreign key constraints the most times
        return false;
      }

      // if ok
      return true;

    }

	}

}

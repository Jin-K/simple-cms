using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using SimpleCRM.Data;
using SimpleCRM.Data.Entities;

namespace SimpleCRM.Business.Providers {

	public class UsersStore {

    /// <summary>
    /// CrmContext's instance.
    /// </summary>
    readonly CrmContext _crmContext;

		/// <summary>
		/// Constructor
		/// </summary>
		/// <remarks>
		/// Sets <see cref="UsersStore._crmContext" /> via DI
		/// </remarks>
		/// <param name="crmContext">main database context of simple-crm</param>
		public UsersStore(CrmContext crmContext) => _crmContext = crmContext;

    /// <summary>
    /// Creates a row if not exists in dbo.Favorites table
    /// </summary>
    /// <param name="userId">user id</param>
    /// <param name="entity">entity name</param>
    /// <param name="itemId">entity item id</param>
    /// <returns>true if no errors</returns>
    public bool CreateFavorite(int userId, string entity, int itemId) {
      
      // get entityId
      var entityId = _crmContext.Entities.SingleOrDefault( e => e.Name == entity )?.Id ?? 0;

      // prepare favorite row
      var toAdd = new Favorite(userId, entityId, itemId);

      // add to favorites
      _crmContext.Favorites.Add(toAdd);

      try {
        // save
        _crmContext.SaveChanges();
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
      var entityId = _crmContext.Entities.SingleOrDefault( e => e.Name == entity )?.Id ?? 0;

      // prepare favorite item for supression
      var toRemove = new Favorite(userId, entityId, itemId);

      // remove from favorites
      _crmContext.Favorites.Remove(toRemove);

      try {
        // save changes
        _crmContext.SaveChanges();
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

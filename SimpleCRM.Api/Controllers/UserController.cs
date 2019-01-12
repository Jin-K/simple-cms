using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SimpleCRM.Business.Providers;

namespace SimpleCRM.Api.Controllers {

  /// <summary>
  /// The main UserController class.
	/// Contains all routes related to users
  /// </summary>
  /// <remarks>
  /// Listed routes:
  /// 
  /// - PUT     user/starred/{userId}/{entity}?id : <see cref="UserController.CreateFavorite(int, string, int)"></see>
  /// 
  /// - DELETE  user/starred/{userId}/{entity}?id : <see cref="UserController.DeleteFavorite(int, string, int)"></see>
  /// 
  /// </remarks>
	[Authorize( AuthenticationSchemes = "Bearer" )]
  [Route( "api/[controller]" )]
	public class UserController : ControllerBase {

    /// <summary>
    /// ElementsStore's instance.
    /// </summary>
    readonly ElementsStore _elementsStore;

    /// <summary>
    /// UsersStore's instance.
    /// </summary>
    readonly UsersStore _usersStore;

    /// <summary>
    /// Constructor
    /// </summary>
    /// <remarks>
    /// sets <see cref="UserController._elementsStore" /> via DI
    /// </remarks>
    /// <param name="elementsStore">store for entities</param>
    public UserController(ElementsStore elementsStore, UsersStore usersStore) {
      _elementsStore = elementsStore;
      _usersStore = usersStore;
    }

    #region Endpoints

    /// <summary>
    /// Adds an entity item as favorite for an user
    /// </summary>
    /// <remarks>
    /// PUT request because adding favorites is idempotent
    /// </remarks>
    /// <param name="userId">user id</param>
    /// <param name="entity">entity name</param>
    /// <param name="id">item id</param>
    /// <returns></returns>
    [HttpPut( "starred/{userId}/{entity}" )]
    public IActionResult CreateFavorite(int userId, string entity, [FromQuery] int id) {

      // TODO Validation

      // if creation fails ==> probably foreign key constraint
      if (!this._usersStore.CreateFavorite(userId, entity, id))
        
        // 409 Conflict
        return StatusCode(StatusCodes.Status409Conflict);
      
      // 204 No Content
      return NoContent();

    }

    /// <summary>
    /// Removes an entity item as favorite for an user
    /// </summary>
    /// <param name="userId">user id</param>
    /// <param name="entity">entity name</param>
    /// <param name="id">item id</param>
    /// <returns></returns>
    [HttpDelete( "starred/{userId}/{entity}" )]
    public IActionResult DeleteFavorite(int userId, string entity, [FromQuery] int id) {

      // TODO Validation

      // if deletion fails ==> probably foreign key constrant
      if (!this._usersStore.DeleteFavorite(userId, entity, id))

        // 409 Conflict
        return StatusCode(StatusCodes.Status409Conflict);

      // 200 OK
      return Ok();

    }

    #endregion

	}

}

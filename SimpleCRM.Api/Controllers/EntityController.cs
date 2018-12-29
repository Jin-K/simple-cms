using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

using SimpleCRM.Api.Models;
using SimpleCRM.Business.Providers;

namespace SimpleCRM.Api.Controllers {

  /// <summary>
  /// The main EntityController class
  /// Handles all the routes for entities and entity items
  /// 
  /// Contains following routes:
  /// 
  /// - GET   entity/items              : <see cref="EntityController.GetItemsList(QueryParameters)"></see>
  /// - GET   entity/entities           : <see cref="EntityController.GetMainEntities()"></see>
  /// - GET   entity/item               : <see cref="EntityController.GetItem(GetItemParameters)"></see>
  /// - GET   entity/entity-items       : <see cref="EntityController.GetEntityItems()"></see>
  /// - POST  entity/entity-items       : <see cref="EntityController.PostEntityItems(string)"></see>
  /// - GET   entity/entity-items-user  : <see cref="EntityController.GetUser()"></see>
  /// - GET   entity/list-view-settings : <see cref="EntityController.GetListViewSettings(int)"></see>
  /// 
  /// </summary>
  [Authorize( AuthenticationSchemes = "Bearer" )]
  [Route( "api/[controller]" )]
  public class EntityController : Controller {

    /// <summary>
    /// EntitiesStore's instance.
    /// 
    /// <seealso cref="EntityController.EntityController(EntitiesStore)" />
    /// </summary>
    readonly EntitiesStore _entitiesStore;

    /// <summary>
    /// Constructor
    /// </summary>
    /// <remarks>
    /// sets <see cref="EntityController._entitiesStore" /> via DI
    /// </remarks>
    /// <param name="entitiesStore">store for entities</param>
    public EntityController(EntitiesStore entitiesStore) => _entitiesStore = entitiesStore;

    #region Endpoints

    /// <summary>
    /// Find items depending on <paramref name="queryParameters"/>
    /// Response has a HATEOAS-like structure, but is still not working.
    /// </summary>
    /// <remarks>
    /// Sets pagination meta data in a response's header called "X-Pagination"
    /// </remarks>
    /// <param name="queryParameters">query and filter parameters</param>
    /// <returns>Returns a HATEOAS-like json response with a chunk of item</returns>
    [HttpGet( "items" )]
    public IActionResult GetItemsList([FromQuery] QueryParameters queryParameters) {
      
        // pascal case of entity name
        var entity = queryParameters.Query.ToUpperCaseFirst();

        // get filtered and ordered items from store
        List<SimpleCRM.Business.Models.Item> value = _entitiesStore.GetOrderedItems(
          entity,
          queryParameters.OrderBy,
          queryParameters.Descending,
          queryParameters.Page,
          queryParameters.PageCount
        ).ToList();

        // count total existing items for an entity
        var allItemCount = _entitiesStore.Count(entity);

        // create pagination meta json
        var paginationMetadata = new {
          totalCount = allItemCount,
          pageSize = queryParameters.PageCount,
          currentPage = queryParameters.Page,
          totalPages = queryParameters.GetTotalPages(allItemCount)
        };

        // sets "X-Pagination" header with paginationMetadata
        Response.Headers.Add( "X-Pagination", JsonConvert.SerializeObject( paginationMetadata ) );

        // create HATEOAS links
        var links = CreateLinksForCollection(queryParameters, allItemCount);

        // returns anonymous type JSON
        return Ok( new { value, links } );

    }

    /// <summary>
    /// Gets all main entities
    /// </summary>
    /// <returns>Returns a basic JSON response containing a list of all the main entities</returns>
    [HttpGet( "entities" )]
    public async Task<IActionResult> GetMainEntities() => Ok( await _entitiesStore.GetAllEntities() );

    /// <summary>
    /// Gets an item depending on query parameters (<paramref name="getItemParameters"/>).
    /// </summary>
    /// <param name="getItemParameters">query and find parameters</param>
    /// <returns>Returns a json object of type <see cref="Item" /></returns>
    [HttpGet( "item" )]
    public IActionResult GetItem([FromQuery] GetItemParameters getItemParameters) {
      
      // get item from store
      var item = _entitiesStore.GetItem(getItemParameters.Entity.ToUpperCaseFirst(), getItemParameters.Id);

      // return as json
      return Ok( item );
    }

    /// <summary>
    /// TODELETE Get dummy entity items for tests
    /// </summary>
    /// <returns>Returns a json array of dummy items</returns>
    [HttpGet( "entity-items" )]
    public IActionResult GetEntityItems() => Ok( this._entitiesStore.GetItems() );

    /// <summary>
    /// TODELETE Post entity item data to fake db
    /// </summary>
    /// <param name="id">id of the item to push or replace</param>
    /// <returns>Returns a <see cref="<see cref="Microsoft.AspNetCore.Http.StatusCodes.Status201Created" />" /></returns>
    [HttpPost( "entity-items/{id}" )]
    public IActionResult PostEntityItems(string id, [FromBody] dynamic rawContent) {

      // post item
      this._entitiesStore.PostItem(id, rawContent);

      // returns 201 created
      return Created( "entity-items", rawContent );
    }
    
    /// <summary>
    /// TODELETE Get dummy entity items user data
    /// </summary>
    /// <returns>Returns a json containing user data</returns>
    [HttpGet( "entity-items-user" )]
    public IActionResult GetEntityItemsUser() => Ok( this._entitiesStore.GetUserData() );

    /// <summary>
    /// Get user view settings for a specific entity
    /// </summary>
    /// <param name="userId">id of user (to pick exact view)</param>
    /// <param name="entityName">entity name</param>
    /// <returns>Returns a json containing view settings</returns>
    [HttpGet( "list-view-settings" )]
    public IActionResult GetListViewSettings(int userId, [FromQuery] string entityName)
    => Ok(new {
      name = entityName,
      id = _entitiesStore.GetEntityIdByName(entityName),
      pagination = new {
        page = 0,
        pageCount = 5,
        orderBy = "id desc",
        totalCount = _entitiesStore.Count(entityName)
      },
      filters = new {
        category = "all"
      }
    });

    #endregion

    /// <summary>
    /// Is supposed to create HATEOAS links but returns an empty list.
    /// 
    /// GLO: <see href="https://app.gitkraken.com/glo/board/XAByRdbmZwAaenb4/card/XBBHIuVFfAAuuGcP">https://app.gitkraken.com/glo/board/XAByRdbmZwAaenb4/card/XBBHIuVFfAAuuGcP</see>
    /// </summary>
    /// <param name="queryParameters">query / filter parameters</param>
    /// <param name="totalCount">total count</param>
    /// <returns>Empty list of objects</returns>
    List<object> CreateLinksForCollection(QueryParameters queryParameters, int totalCount) {
      
      // create list of links
      var links = new List<object>();

      // return links
      return links;
    }
  
  }

}

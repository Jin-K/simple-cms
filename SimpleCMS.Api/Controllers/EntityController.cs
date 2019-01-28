using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SimpleCMS.Api.Extensions;
using SimpleCMS.Api.Models;
using SimpleCMS.Business.Providers;
using SimpleCMS.Common.Extensions;

namespace SimpleCMS.Api.Controllers {

	/// <summary>
	/// The main EntityController class
	/// Handles all the routes for entities and entity items
	/// </summary>
	/// <remarks>
	/// Contains following routes:
	/// 
	/// - GET     entity/items?entity&amp;page&amp;pageCount(&amp;orderBy)(&amp;userId)(&amp;category)  : <see cref="EntityController.GetItemsList(QueryParameters)"></see>
	///
	/// - GET     entity/inverse-ids/{inverseIds}?entity(&amp;category)(&amp;userId)                    : <see cref="EntityController.GetInverseIdsForDeletion(QueryParameters)"></see>
	///
	/// - GET     entity/entities                                                                       : <see cref="EntityController.GetMainEntities()"></see>
	///
	/// - GET     entity/item?entity&amp;id                                                             : <see cref="EntityController.GetItem(GetItemParameters)"></see>
	///
	/// - DELETE  entity/{entity}/{ids}                                                                 : <see cref="EntityController.DeleteItemOrItems(string, string)"></see>
	///
	/// - GET     entity/entity-items                                                                   : <see cref="EntityController.GetEntityItems()"></see>
	///
	/// - POST    entity/entity-items/{id}                                                              : <see cref="EntityController.PostEntityItems(string, dynamic)"></see>
	///
	/// - GET     entity/entity-items-user                                                              : <see cref="EntityController.GetEntityItemsUser()"></see>
	///
	/// - GET     entity/list-view-settings                                                             : <see cref="EntityController.GetListViewSettings(string)"></see>
	/// </remarks>
	[Authorize(AuthenticationSchemes = "Bearer")]
	[Route("api/[controller]")]
	public class EntityController : ControllerBase {

		/// <summary>
		/// ElementsStore's instance.
		/// 
		/// <seealso cref="EntityController.EntityController(IElementsStore)" />
		/// </summary>
		readonly IElementsStore _elementsStore;

		/// <summary>
		/// Constructor
		/// </summary>
		/// <remarks>
		/// sets <see cref="EntityController._elementsStore" /> via DI
		/// </remarks>
		/// <param name="elementsStore">store for entities</param>
		public EntityController(IElementsStore elementsStore)
		=> _elementsStore = elementsStore;

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
		[HttpGet("items")]
		public IActionResult GetItemsList([FromQuery] QueryParameters queryParameters) {

			// pascal case of entity name
			var entity = queryParameters.Entity.ToUpperCaseFirst();

			// prepare userId
			var userId = queryParameters.UserId ?? -int.Parse(HttpContext.User.GetSub());

			// get filtered and ordered items from store
			List<Business.Models.Item> value = _elementsStore.GetFilteredAndOrderedItems(
			  entity,
			  queryParameters.OrderBy,
			  queryParameters.Descending,
			  (uint)queryParameters.Page,
			  (uint)queryParameters.PageCount,
			  out var allItemCount,
			  userId,
			  queryParameters.ListCategory
			).ToList();

			// create pagination meta json anonymous object
			var paginationMetaHeader = new {
				totalCount = allItemCount,
				pageSize = queryParameters.PageCount,
				currentPage = queryParameters.Page,
				totalPages = queryParameters.GetTotalPages(allItemCount)
			};

			// set "X-Pagination" header
			Response.Headers.Add("X-Pagination", JsonConvert.SerializeObject(paginationMetaHeader));

			// create HATEOAS links
			var links = CreateLinksForCollection(queryParameters, allItemCount);

			// return anonymous type JSON
			return Ok(new { value, links });

		}

		/// <summary>
		/// Gets, for a given <paramref name="entity" />, the list of ids opposite/inverse to received <paramref name="inverseIds" />,
		/// depends on optional filters (<paramref name="category" />, <paramref name="userId" />)
		/// </summary>
		/// <param name="inverseIds">inverse ids string separated with '+'</param>
		/// <param name="entity">entity name</param>
		/// <param name="category">optional category ("all" or "favorites")</param>
		/// <param name="userId">optional user id</param>
		/// <returns>Returns the list of normalized ids</returns>
		[HttpGet("inverse-ids/{inverseIds}")]
		public IActionResult GetInverseIdsForDeletion(string inverseIds, [FromQuery] string entity, [FromQuery] string category, [FromQuery] int? userId) {

			// if category defined but not "all" or "favorites" ==> 400 Bad Request
			if (!string.IsNullOrEmpty(category) && category != "all" && category != "favorites") return BadRequest(new { error = "Invalid value for category" });

			// split inverse ids
			var inverseIdsStringArray = inverseIds.Split('+', StringSplitOptions.RemoveEmptyEntries);

			// prepare set of integers
			var inverseIdsIntegerSet = new HashSet<int>();

			// iterate array of string ids
			foreach (var inverseStringId in inverseIdsStringArray) {

				// if non numeric id in array ==> bad field/parameters ==> 400 Bad Request
				if (!int.TryParse(inverseStringId, out int inverseIntegerId)) return BadRequest();

				// otherwise, add to set
				inverseIdsIntegerSet.Add(inverseIntegerId);
			}

			// if just no inverse id received
			if (inverseIdsIntegerSet.Count == 0) return StatusCode(StatusCodes.Status422UnprocessableEntity);

			// if no userId ==> negative value of current user id
			if (!userId.HasValue) userId = -int.Parse(HttpContext.User.GetSub());

			// get max 100 correct ids from store
			var normalizedIds = _elementsStore.GetInverseIdsForEntity(entity, userId.Value, category, inverseIdsIntegerSet.ToArray());

			// return list of items (200 OK)
			return Ok(normalizedIds);

		}

		/// <summary>
		/// Gets all main entities
		/// </summary>
		/// <returns>Returns a basic JSON response containing a list of all the main entities</returns>
		[HttpGet("entities")]
		public async Task<IActionResult> GetMainEntities() => Ok(await _elementsStore.GetAllEntities());

		/// <summary>
		/// Gets an item depending on query parameters (<paramref name="getItemParameters"/>).
		/// </summary>
		/// <param name="getItemParameters">query and find parameters</param>
		/// <returns>Returns a json object of type <see cref="Item" /></returns>
		[HttpGet("item")]
		public IActionResult GetItem([FromQuery] GetItemParameters getItemParameters) {

			// get item from store
			var item = _elementsStore.GetItem(getItemParameters.Entity.ToUpperCaseFirst(), getItemParameters.Id);

			// return as json
			return Ok(item);
		}

		/// <summary>
		/// Deletes one or multiple items on a given <paramref name="entity" />
		/// </summary>
		/// <remarks>
		/// Parameter <paramref name="ids" /> is a string containing 1 or multiple numeric ids.
		/// If multiple ids are specified, they should be separated with a '+'
		/// </remarks>
		/// <param name="entity">entity name</param>
		/// <param name="ids">id or list of ids separated by '+'</param>
		/// <returns></returns>
		[HttpDelete("{entity}/{ids}")]
		public IActionResult DeleteItemOrItems(string entity, string ids) {

			// split ids
			var idsStringArray = ids.Split('+', StringSplitOptions.RemoveEmptyEntries);

			// prepare set of integers
			var idsIntegerSet = new HashSet<int>();

			// iterate array of string ids
			foreach (var stringId in idsStringArray) {

				// if non numeric id in array ==> bad field/parameters ==> 400 Bad Request
				if (!int.TryParse(stringId, out int integerId)) return BadRequest();

				// otherwise, add to set
				idsIntegerSet.Add(integerId);
			}

			switch (idsIntegerSet.Count) {

			// no id
			case 0:

				// validation issues (StatusCode 422)
				return StatusCode(StatusCodes.Status422UnprocessableEntity);

			// 1 id
			case 1:

				// if delete item not ok ==> Conflict with foreign key constraint
				if (!this._elementsStore.DeleteItem(entity, idsIntegerSet.First())) {

					// 409 Conflict
					return StatusCode(StatusCodes.Status409Conflict);
				}

				break;

			// multiple ids
			default:

				// if delete items not ok ==> Conflict ?
				if (!this._elementsStore.DeleteItems(entity, idsIntegerSet.ToArray())) {

					// 409 Conflict
					return StatusCode(StatusCodes.Status409Conflict);
				}

				break;

			}

			// 200 OK
			return Ok();

		}

		/// <summary>
		/// TODELETE Get dummy entity items for tests
		/// </summary>
		/// <returns>Returns a json array of dummy items</returns>
		[HttpGet("entity-items")]
		public IActionResult GetEntityItems() => Ok(this._elementsStore.GetItems());

		/// <summary>
		/// TODELETE Post entity item data to fake db
		/// </summary>
		/// <param name="id">id of the item to push or replace</param>
		/// <returns>Returns a <see cref="<see cref="Microsoft.AspNetCore.Http.StatusCodes.Status201Created" />" /></returns>
		[HttpPost("entity-items/{id}")]
		public IActionResult PostEntityItems(string id, [FromBody] dynamic rawContent) {

			// post item
			this._elementsStore.PostItem(id, rawContent);

			// returns 201 created
			return Created("entity-items", rawContent);
		}

		/// <summary>
		/// TODELETE Get dummy entity items user data
		/// </summary>
		/// <returns>Returns a json containing user data</returns>
		[HttpGet("entity-items-user")]
		public IActionResult GetEntityItemsUser() => Ok(this._elementsStore.GetUserData());

		/// <summary>
		/// Get user view settings for a specific entity
		/// </summary>
		/// <param name="entityName">entity name</param>
		/// <returns>Returns a json containing view settings</returns>
		[HttpGet("list-view-settings")]
		public IActionResult GetListViewSettings([FromQuery] string entityName)
		=> Ok(new {
			name = entityName,
			id = _elementsStore.GetEntityIdByName(entityName),
			pagination = new {
				page = 0,
				pageCount = 5,
				orderBy = "id desc",
				totalCount = _elementsStore.GetTotalItemsCount(entityName)
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

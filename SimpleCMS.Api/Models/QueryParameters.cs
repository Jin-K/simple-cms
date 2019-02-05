using Newtonsoft.Json;
using SimpleCMS.Business.Providers;
using System;
using System.Linq;

namespace SimpleCMS.Api.Models {

	/// <summary>
	/// The main QueryParameters class
	/// </summary>
	/// <remarks>
	/// Used as structure for query string parameters on /api/entity/items
	/// </remarks>
	public class QueryParameters {

		#region Private members, constants

		/// <summary>
		/// Constant integer for the max page count
		/// </summary>
		private const int MaxPageCount = 100;

		/// <summary>
		/// Private page count
		/// </summary>
		private int _pageCount = MaxPageCount;

		#endregion

		#region Public members, accessors

		/// <summary>
		/// Entity name
		/// </summary>
		/// <value>Returns the entity name</value>
		[JsonProperty]
		public string Entity { get; set; }

		/// <summary>
		/// Active page
		/// </summary>
		/// <value>Returns the active page or 1 as default value</value>
		[JsonProperty]
		public int Page { get; set; } = 1;

		/// <summary>
		/// PageCount accessor (depends on <see cref="_pageCount" /> and <see cref="MaxPageCount" />)
		/// </summary>
		[JsonProperty]
		public int PageCount {
			get => _pageCount;
			set => _pageCount = ( value > MaxPageCount ) ? MaxPageCount : value;
		}

		/// <summary>
		/// "Order by" string containing column name and direction (asc, desc)
		/// </summary>
		/// <value>Returns the "order by" string, or "Id" as default value</value>
		[JsonProperty]
		public string OrderBy { get; set; } = "Id";

		/// <summary>
		/// User id for which to display list of items, is not required
		/// </summary>
		/// <remarks>
		/// Used to give the list of items belonging to that user
		/// </remarks>
		/// <value>Returns the specified user id or null</value>
		[JsonProperty]
		public int? UserId { get; set; }

		/// <summary>
		/// Category of items list to show ("all" or "favorites")
		/// </summary>
		/// <value>Returns the category or "all" as default value</value>
		[JsonProperty]
		public string Category { get; set; } = "all";

		#endregion

		#region Internal members, helpers

		/// <summary>
		/// Is the OrderBy descending (" desc") ?
		/// </summary>
		/// <returns>Returns true if descending, false if ascending</returns>
		internal bool Descending
			=> !string.IsNullOrEmpty( OrderBy ) ? OrderBy.Split( ' ' ).Last().ToLowerInvariant().StartsWith( "desc" ) : false;

		/// <summary>
		/// Category type of list
		/// </summary>
		/// <value>Returns the converted to <see cref="EntityListCategory" /> value of <see cref="Category" /></value>
		internal EntityListCategory ListCategory {
			get {
				switch (Category) {
					case "favorites": return EntityListCategory.Favorites;
					default: return EntityListCategory.All;
				}
			}
		}

		/// <summary>
		/// Help method to get the total pages depending on <see cref="PageCount" />
		/// </summary>
		/// <param name="totalCount">total count of existing items</param>
		/// <returns>Returns the total count of pages</returns>
		internal double GetTotalPages(int totalCount)
			=> Math.Ceiling( totalCount / (double) PageCount );

		#endregion

	}

}

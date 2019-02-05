using Microsoft.AspNetCore.Mvc;
using SimpleCMS.Business.Providers;
using System.Threading.Tasks;

namespace SimpleCMS.Api.Controllers {

	/// <summary>
	/// The main NewsController class
	/// </summary>
	/// <inheritdoc />
	[Route( "api/[controller]" )]
	public class NewsController : ControllerBase {

		/// <summary>
		/// Injected store for news
		/// </summary>
		private readonly NewsStore _newsStore;

		/// <summary>
		/// Constructor
		/// </summary>
		/// <param name="newsStore">store for news (injected by DI)</param>
		public NewsController(NewsStore newsStore) => _newsStore = newsStore;

		/// <summary>
		/// Adds a group
		/// </summary>
		/// <param name="group">group name to add</param>
		/// <returns>Returns a <see cref="Microsoft.AspNetCore.Http.StatusCodes.Status201Created" /> response</returns>
		[HttpPost]
		public async Task<IActionResult> AddGroup([FromQuery] string group) {
			if (string.IsNullOrEmpty( group )) return BadRequest();
			await _newsStore.AddGroup( group );
			return Created( "AddGroup", group );
		}

		/// <summary>
		/// Gets all groups
		/// </summary>
		/// <returns>Returns a list of strings containing names of all groups</returns>
		[HttpGet]
		public async Task<IActionResult> GetAllGroups()
			=> Ok( await _newsStore.GetAllGroups() );

	}

}

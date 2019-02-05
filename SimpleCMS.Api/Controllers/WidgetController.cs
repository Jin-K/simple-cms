using Microsoft.AspNetCore.Mvc;
using SimpleCMS.Business.Providers;
using SimpleCMS.Data.Entities;

namespace SimpleCMS.Api.Controllers {

	/// <summary>
	/// The main WidgetController class
	/// </summary>
	/// <inheritdoc />
	[Route( "api/[controller]" )]
	public class WidgetController : ControllerBase {

		/// <summary>
		/// Store for widgets
		/// </summary>
		private readonly WidgetsStore _widgetsStore;

		/// <summary>
		/// Controller
		/// </summary>
		/// <param name="widgetsStore">store for widgets (injected by DI)</param>
		public WidgetController(WidgetsStore widgetsStore)
			=> _widgetsStore = widgetsStore;

		/// <summary>
		/// Gets all widgets
		/// </summary>
		/// <returns>Returns an enumerable of all widgets (generic type: <see cref="Widget" /></returns>
		[HttpGet]
		public IActionResult GetAllWidgets()
			=> Ok( _widgetsStore.GetAllWidgets() );

	}

}

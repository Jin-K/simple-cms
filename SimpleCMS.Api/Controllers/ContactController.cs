using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SimpleCMS.Business.Services;
using SimpleCMS.Business.ViewModels;
using SimpleCMS.Data.Entities;

namespace SimpleCMS.Api.Controllers {

	[Authorize( AuthenticationSchemes = "Bearer" )]
	[Route( "api/[controller]" )]
	public class ContactController : ControllerBase {

		private readonly IEntityService _entityService;

		public ContactController(IEntityService entityService) => _entityService = entityService;

		[HttpGet]
		[AllowAnonymous]
		public IActionResult Index()
			=> Ok( _entityService.GetAll<Contact>() );

		[HttpGet]
		[Route( "{id:int}" )]
		public IActionResult Details(int id) {

			if (id == 0) return NotFound();

			var contact = _entityService.GetById<Contact>( id );

			if (contact == null) return NotFound();

			return Ok( contact );

		}

		[HttpPost]
		[Route( "" )]
		public IActionResult Create(ContactViewModel contactViewModel) {

			if (!ModelState.IsValid) return ValidationProblem();

			_entityService.Create( contactViewModel );

			return Created( string.Empty, contactViewModel );
		}

	}

}

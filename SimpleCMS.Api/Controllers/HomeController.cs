using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SimpleCMS.Api.Controllers {
	[Route( "api" )]
	public class HomeController : ControllerBase {
		// GET: /<controller>/
		public IActionResult Index() {
			return Ok(new { Status = "OK" });
		}
	}
}

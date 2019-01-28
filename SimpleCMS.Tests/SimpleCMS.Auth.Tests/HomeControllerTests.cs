using System;
using Microsoft.AspNetCore.Mvc;
using SimpleCMS.Auth.Controllers;
using Xunit;

namespace SimpleCMS.Auth.Tests {

	public class HomeControllerTests {

		[Fact]
		public void VerifyIndexViewType() {

			// Arrange
			var controller = new HomeController();

			// Act
			var result = controller.Index();

			// Assert
			Assert.IsType<ViewResult>(result);

		}

	}

}

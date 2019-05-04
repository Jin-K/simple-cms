using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using SimpleCMS.Api.Controllers;
using Xunit;

namespace SimpleCMS.Api.Tests {

	public class ChatControllerTests {

		[Fact]
		public void VerifyGetChatsCount() {

			// Arrange
			var controller = new ChatController();

			// Act
			var result = Assert.IsType<OkObjectResult>(controller.GetChats());
			var list = Assert.IsType<List<dynamic>>(result.Value);

			// Assert
			Assert.Equal(3, list.Count);

		}

		[Fact]
		public void VerifyGetContactsCount() {

			// Arrange
			var controller = new ChatController();

			// Act
			var result = Assert.IsType<OkObjectResult>(controller.GetContacts());
			var list = Assert.IsType<List<dynamic>>(result.Value);

			// Assert
			Assert.Equal(25, list.Count);

		}

	}

}

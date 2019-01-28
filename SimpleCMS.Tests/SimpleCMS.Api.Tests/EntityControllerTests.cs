using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using SimpleCMS.Api.Controllers;
using SimpleCMS.Business.Models;
using SimpleCMS.Business.Providers;
using Xunit;

namespace SimpleCMS.Api.Tests {

	public class EntityControllerTests {

		private readonly IElementsStore _elementsStore;

		public EntityControllerTests() {

			// create mock of elements store
			var elementsStoreMock = new Mock<IElementsStore>();

			// setup some invokable methods of mock
			elementsStoreMock.Setup(x => x.GetAllEntities()).ReturnsAsync(new List<Entidad>{
				new Entidad { Id = 10, Name = "Companies" },
				new Entidad { Id = 11, Name = "Contacts" },
				new Entidad { Id = 20, Name = "Projects" },
				new Entidad { Id = 31, Name = "Documents" },
				new Entidad { Id = 32, Name = "Actions" }
			});

			// store field
			_elementsStore = elementsStoreMock.Object;

		}

		[Fact]
		public async Task VerifyListMainEntities() {

			// Arrange
			var controller = new EntityController(_elementsStore);

			// Act
			var result = Assert.IsType<OkObjectResult>(await controller.GetMainEntities());
			var list = Assert.IsType<List<Entidad>>(result.Value);

			// Assert
			Assert.Equal(5, list.Count);

		}

	}

}

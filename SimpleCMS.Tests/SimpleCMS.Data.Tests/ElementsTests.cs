using System;
using Xunit;
using SimpleCMS.Data;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Collections.Generic;
using SimpleCMS.Data.Entities;
using System.Linq;
using GenFu;
using SimpleCMS.Business.Providers;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;
using Action = SimpleCMS.Data.Entities.Action;

namespace SimpleCMS.Data.Tests {

	public class ElementsTests : CmsContextTestBase {

		[Fact]
		public async Task ShouldReturnAllEntitites() {

			// arrange
            var service = new ElementsStore(_context);

            // act
            var results = await service.GetAllEntities();
            var count = results.Count();

            // assert
            Assert.Equal(5, count);

		}

		[Fact]
		public void ShouldReturnAllContacts() {

			// arrange
            var service = new ElementsStore(_context);

            // act
            var count = service.GetTotalItemsCount("Contacts");

            // assert
            Assert.Equal(17, count);

		}

		[Fact]
		public void ShouldReturnAllCompanies() {

			// arrange
            var service = new ElementsStore(_context);

            // act
            var count = service.GetTotalItemsCount("Companies");

            // assert
            Assert.Equal(2, count);

		}

		[Fact]
		public void ShouldReturnAllActions() {

			// arrange
            var service = new ElementsStore(_context);

            // act
            var count = service.GetTotalItemsCount("Actions");

            // assert
            Assert.Equal(3, count);

		}

	}

}

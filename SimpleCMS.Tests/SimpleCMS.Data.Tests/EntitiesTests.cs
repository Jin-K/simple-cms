using System.Linq;
using System.Threading.Tasks;
using SimpleCMS.Business.Providers;
using Xunit;

namespace SimpleCMS.Data.Tests {

	public class EntitiesTests : CmsContextTestBase {

		[Fact]
		public void ShouldReturn5Entitites() {

			// arrange
			var service = new ElementsStore(_context);

			// act
			var results = service.GetAllEntities();
			var count = results.Count();

			// assert
			Assert.Equal(5, count);

		}

		[Fact]
		public void ShouldReturn17Contacts() {

			// arrange
			var service = new ElementsStore(_context);

			// act
			var count = service.GetTotalItemsCount("Contacts");

			// assert
			Assert.Equal(17, count);

		}

		[Fact]
		public void ShouldReturn2Companies() {

			// arrange
			var service = new ElementsStore(_context);

			// act
			var count = service.GetTotalItemsCount("Companies");

			// assert
			Assert.Equal(2, count);

		}

		[Fact]
		public void ShouldReturn3Actions() {

			// arrange
			var service = new ElementsStore(_context);

			// act
			var count = service.GetTotalItemsCount("Actions");

			// assert
			Assert.Equal(3, count);

		}

	}

}

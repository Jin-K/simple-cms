using System.Threading.Tasks;
using SimpleCMS.Business.Providers;
using Xunit;

namespace SimpleCMS.Data.Tests {

	public class OtherTests : CmsContextTestBase {

		[Fact]
		public async Task ShouldReturn4Addresses() {

			// arrange
			var service = new MiscStore(_context);

			// act
			var result = await service.GetAllAddresses();
			var count = result.Count;

			// assert
			Assert.Equal(4, count);

		}

		[Fact]
		public async Task ShouldReturn7Favorites() {

			// arrange
			var service = new MiscStore(_context);

			// act
			var result = await service.GetAllFavorites();
			var count = result.Count;

			// assert
			Assert.Equal(7, count);

		}

		[Fact]
		public async Task ShouldReturn5Labels() {

			// arrange
			var service = new MiscStore(_context);

			// act
			var result = await service.GetAllLabels();
			var count = result.Count;

			// assert
			Assert.Equal(5, count);

		}

		[Fact]
		public async Task ShouldReturn4NewsGroups() {

			// arrange
			var service = new MiscStore(_context);

			// act
			var result = await service.GetAllNewsGroups();
			var count = result.Count;

			// assert
			Assert.Equal(4, count);

		}

		[Fact]
		public async Task ShouldReturn17NewsItemEntities() {

			// arrange
			var service = new MiscStore(_context);

			// act
			var result = await service.GetAllNewsItemEntities();
			var count = result.Count;

			// assert
			Assert.Equal(17, count);

		}

		[Fact]
		public async Task ShouldReturn1Widget() {

			// arrange
			var service = new MiscStore(_context);

			// act
			var result = await service.GetAllWidgets();
			var count = result.Count;

			// assert
			Assert.Equal(1, count);

		}

	}

}

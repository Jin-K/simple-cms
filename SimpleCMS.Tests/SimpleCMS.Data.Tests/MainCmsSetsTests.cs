using System.Threading.Tasks;
using SimpleCMS.Business.Providers;
using Xunit;

namespace SimpleCMS.Data.Tests {

	public class MainCmsSetsTests : CmsContextTestBase {

		[Fact]
		public async Task ShouldReturn0Accounts() {

			// arrange
			var service = new MainStore(_context);

			// act
			var result = await service.GetAllAccounts();
			var count = result.Count;

			// assert
			Assert.Equal(0, count);

		}

		[Fact]
		public async Task ShouldReturn5Entities() {

			// arrange
			var service = new MainStore(_context);

			// act
			var result = await service.GetAllEntities();
			var count = result.Count;

			// assert
			Assert.Equal(5, count);

		}

	}

}

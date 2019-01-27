using System.Threading.Tasks;
using NSubstitute;
using SimpleCMS.Business.Providers;
using Xunit;

namespace SimpleCMS.Tests.Acceptance
{
    public class UnitTest1
    {

        private readonly INewsStore _newsStore;
        
        public UnitTest1()
        {
            _newsStore = Substitute.For<INewsStore>();
        }

        [Fact]
        public void Test1()
        {
            // Arrange
            const double expected = 5;
            
            // Act
            const double actual = 3 + 2;
            
            // Assert
            Assert.Equal(expected, actual);
        }

        [Fact]
        public async Task Test2()
        {
            await _newsStore.AddGroup("test");
        }
    }
}
using Xunit;

namespace SimpleCRM.Tests.Acceptance
{
    public class UnitTest1
    {
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
    }
}
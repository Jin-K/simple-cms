using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace SimpleCMS.Data.Tests {

	public abstract class CmsContextTestBase : IDisposable {
        
        protected readonly CmsContext _context;

		public CmsContextTestBase() {

			var serviceProvider = new ServiceCollection()
				.AddEntityFrameworkInMemoryDatabase()
				.BuildServiceProvider();

			var options = new DbContextOptionsBuilder<CmsContext>()
				.UseInMemoryDatabase(Guid.NewGuid().ToString())
				.UseInternalServiceProvider(serviceProvider)
				.Options;

			_context = new CmsContext(options);

			_context.Database.EnsureCreated();

		}

		public void Dispose() {

            _context.Database.EnsureDeleted();
            _context.Dispose();

		}

	}

}

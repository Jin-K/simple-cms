using System.Collections.Generic;

namespace SimpleCMS.Business.Services {

	public interface IEntityService {

		T GetById<T>(int id) where T : class;

		IEnumerable<T> GetAll<T>() where T : class;

		void Create<T>(T viewModel) where T : class;

	}

}
using System.Collections.Generic;
using System.Threading.Tasks;
using SimpleCMS.Data.Entities;

namespace SimpleCMS.Business.Providers {

	public interface IMainStore {

		Task<List<Entity>> GetAllEntities();

		Task<List<Account>> GetAllAccounts();

	}

}

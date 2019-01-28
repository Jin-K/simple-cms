using System.Collections.Generic;
using System.Threading.Tasks;
using SimpleCMS.Data.Entities;
using Label = SimpleCMS.Data.Entities._Label;

namespace SimpleCMS.Business.Providers {

	public interface IMiscStore {

		Task<List<Label>> GetAllLabels();

		Task<List<Widget>> GetAllWidgets();

		Task<List<Address>> GetAllAddresses();

		Task<List<Favorite>> GetAllFavorites();

		Task<List<NewsItemEntity>> GetAllNewsItemEntities();

		Task<List<NewsGroup>> GetAllNewsGroups();

	}

}

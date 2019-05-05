using SimpleCMS.Data;
using SimpleCMS.Data.Entities;

namespace SimpleCMS.Business.Repositories {

	public class ActionRepository : IActionRepository {
		
		private Repository<Action> _genericRepository;

		public ActionRepository(CmsContext context) => _genericRepository = new Repository<Action>(context);

		public Action GetAction(int contactId)
			=> _genericRepository.Get(contactId);

		public void AddAction(Action contact)
			=> _genericRepository.Add(contact);

		public void UpdateAction(Action contact)
			=> _genericRepository.Update(contact);

	}

}

using SimpleCMS.Data.Entities;

namespace SimpleCMS.Data.Repositories {

	/// <summary>
	/// The main <see cref="ActionRepository"/> class.
	/// </summary>
	public class ActionRepository : Repository<Action>, IActionRepository {

		public ActionRepository(CmsContext context) : base(context) {}

		public Action GetAction(int contactId)
			=> Get(contactId);

		public void AddAction(Action contact)
			=> Add(contact);

		public void UpdateAction(Action contact)
			=> Update(contact);

	}

}

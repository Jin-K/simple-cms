using SimpleCMS.Data.Entities;

namespace SimpleCMS.Data.Repositories {

	/// <summary>
	/// The main <see cref="ContactRepository"/> class.
	/// </summary>
	public class ContactRepository : Repository<Contact>, IContactRepository {

		public ContactRepository(CmsContext context) : base( context ) { }

		public Contact GetContact(int contactId)
			=> Get(contactId);

		public void AddContact(Contact contact)
			=> Add(contact);

		public void UpdateContact(Contact contact)
			=> Update(contact);

	}

}

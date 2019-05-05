using SimpleCMS.Data;
using SimpleCMS.Data.Entities;

namespace SimpleCMS.Business.Repositories {

	public class ContactRepository : IContactRepository {
		
		private Repository<Contact> _genericRepository;

		public ContactRepository(CmsContext context) => _genericRepository = new Repository<Contact>(context);

		public Contact GetContact(int contactId)
			=> _genericRepository.Get(contactId);

		public void AddContact(Contact contact)
			=> _genericRepository.Add(contact);

		public void UpdateContact(Contact contact)
			=> _genericRepository.Update(contact);

	}

}

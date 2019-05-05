using SimpleCMS.Data.Entities;

namespace SimpleCMS.Business.Repositories {

	public interface IContactRepository {

		Contact GetContact(int contactId);

		void AddContact(Contact contact);

		void UpdateContact(Contact contact);

	}

}
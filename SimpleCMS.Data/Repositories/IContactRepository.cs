using SimpleCMS.Data.Entities;

namespace SimpleCMS.Data.Repositories {

	/// <summary>
	/// The main <see cref="IContactRepository"/> interface.
	/// </summary>
	public interface IContactRepository {

		Contact GetContact(int contactId);

		void AddContact(Contact contact);

		void UpdateContact(Contact contact);

	}

}
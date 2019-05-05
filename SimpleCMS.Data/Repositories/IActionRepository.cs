using SimpleCMS.Data.Entities;

namespace SimpleCMS.Data.Repositories {

	/// <summary>
	/// The main <see cref="IActionRepository"/> interface.
	/// </summary>
	public interface IActionRepository {

		Action GetAction(int contactId);

		void AddAction(Action contact);

		void UpdateAction(Action contact);

	}

}
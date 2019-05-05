using SimpleCMS.Data.Entities;

namespace SimpleCMS.Business.Repositories {

	public interface IActionRepository {

		Action GetAction(int contactId);

		void AddAction(Action contact);

		void UpdateAction(Action contact);

	}

}
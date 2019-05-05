using SimpleCMS.Data.Entities;

namespace SimpleCMS.Data.Repositories {

	/// <summary>
	/// The main <see cref="ICompanyRepository"/> interface.
	/// </summary>
	public interface ICompanyRepository {

		Company GetCompany(int contactId);

		void AddCompany(Company contact);

		void UpdateCompany(Company contact);

	}

}
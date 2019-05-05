using SimpleCMS.Data.Entities;

namespace SimpleCMS.Business.Repositories {

	public interface ICompanyRepository {

		Company GetCompany(int contactId);

		void AddCompany(Company contact);

		void UpdateCompany(Company contact);

	}

}
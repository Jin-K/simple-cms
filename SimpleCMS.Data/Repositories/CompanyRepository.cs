using SimpleCMS.Data.Entities;

namespace SimpleCMS.Data.Repositories {

	/// <summary>
	/// The main <see cref="CompanyRepository"/> class.
	/// </summary>
	public class CompanyRepository : Repository<Company>, ICompanyRepository {

		public CompanyRepository(CmsContext context) : base( context ) { }

		public Company GetCompany(int contactId)
			=> Get(contactId);

		public void AddCompany(Company contact)
			=> Add(contact);

		public void UpdateCompany(Company contact)
			=> Update(contact);

	}

}

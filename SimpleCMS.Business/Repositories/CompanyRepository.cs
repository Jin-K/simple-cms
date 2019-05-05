using SimpleCMS.Data;
using SimpleCMS.Data.Entities;

namespace SimpleCMS.Business.Repositories {

	public class CompanyRepository : ICompanyRepository {
		
		private Repository<Company> _genericRepository;

		public CompanyRepository(CmsContext context) => _genericRepository = new Repository<Company>(context);

		public Company GetCompany(int contactId)
			=> _genericRepository.Get(contactId);

		public void AddCompany(Company contact)
			=> _genericRepository.Add(contact);

		public void UpdateCompany(Company contact)
			=> _genericRepository.Update(contact);

	}

}

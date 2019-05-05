using AutoMapper;
using SimpleCMS.Business.ViewModels;
using SimpleCMS.Data.Entities;

namespace SimpleCMS.Business.AutoMapper {

	public class ViewModelToPersistanceMappingProfile : Profile {

		/// <summary>
		/// TODO: Finish this, empty objects are created for the moment
		/// </summary>
		public ViewModelToPersistanceMappingProfile() {
			CreateMap<ContactViewModel, Contact>()
				.ConstructUsing( c => new Contact() );
			CreateMap<CompanyViewModel, Company>()
				.ConstructUsing( c => new Company() );
			CreateMap<ActionViewModel, Action>()
				.ConstructUsing( c => new Action() );
		}

	}

}
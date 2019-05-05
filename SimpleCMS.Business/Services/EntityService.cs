using SimpleCMS.Business.ViewModels;
using SimpleCMS.Data.Entities;
using SimpleCMS.Domain.Interfaces;
using System.Collections.Generic;
using AutoMapper;
using Action = SimpleCMS.Data.Entities.Action;

namespace SimpleCMS.Business.Services {

	public class EntityService : IEntityService {

		private readonly IUnitOfWork _unitOfWork;
		private readonly IMapper _mapper;

		public EntityService(IUnitOfWork unitOfWork, IMapper mapper) {
			_unitOfWork = unitOfWork;
			_mapper = mapper;
		}

		public T GetById<T>(int id) where T : class
			=> _unitOfWork.Repository<T>().Get( id );

		public IEnumerable<T> GetAll<T>() where T : class
			=> _unitOfWork.Repository<T>().GetAll();
		
		public void Create<T>(T viewModel) where T : class {

			switch (viewModel) {
			case ContactViewModel contactViewModel:
				var contact = _mapper.Map<Contact>(contactViewModel);
				_unitOfWork.Repository<Contact>().Add( contact );
				break;
			case CompanyViewModel companyViewModel:
				var company = _mapper.Map<Company>( companyViewModel );
				_unitOfWork.Repository<Company>().Add( company );
				break;
			case ActionViewModel actionViewModel:
				var action = _mapper.Map<Action>( actionViewModel );
				_unitOfWork.Repository<Action>().Add( action );
				break;
			}

		}

	}

}
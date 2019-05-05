using AutoMapper;

namespace SimpleCMS.Business.AutoMapper {

	public class AutoMapperConfig {

		public static MapperConfiguration RegisterMappings() {

			return new MapperConfiguration( configure => {
				configure.AddProfile( new ViewModelToPersistanceMappingProfile() );
			} );

		}

	}

}

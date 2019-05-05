using System;
using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using SimpleCMS.Business.AutoMapper;

namespace SimpleCMS.Api.Extensions {

	public static class AutoMapperExtensions {

		public static void AddAutoMapperSetup(this IServiceCollection services) {

			if (services == null) throw new ArgumentNullException( nameof( services ) );

			services.AddAutoMapper();

			AutoMapperConfig.RegisterMappings();

		}

	}

}

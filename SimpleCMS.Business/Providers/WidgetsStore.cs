using SimpleCMS.Data;
using SimpleCMS.Data.Entities;
using System.Collections.Generic;
using System.Linq;

namespace SimpleCMS.Business.Providers {

	public class WidgetsStore {

		private readonly CmsContext _cmsContext;

		public WidgetsStore(CmsContext cmsContext) => _cmsContext = cmsContext;

		public IEnumerable<Widget> GetAllWidgets()
			=> _cmsContext.Widgets.ToList();

	}

}

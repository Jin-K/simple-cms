using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SimpleCMS.Data;
using SimpleCMS.Data.Entities;

namespace SimpleCMS.Business.Providers {
  public class WidgetsStore {
    readonly CmsContext _cmsContext;
    public WidgetsStore(CmsContext cmsContext) {
      _cmsContext = cmsContext;
    }

    public async Task<IEnumerable<Widget>> GetAllWidgets() => await _cmsContext.Widgets.ToListAsync();
  }
}

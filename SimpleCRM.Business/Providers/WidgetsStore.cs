using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SimpleCRM.Data;
using SimpleCRM.Data.Entities;

namespace SimpleCRM.Business.Providers {
  public class WidgetsStore {
    readonly CrmContext _crmContext;
    public WidgetsStore(CrmContext crmContext) {
      _crmContext = crmContext;
    }

    public async Task<IEnumerable<Widget>> GetAllWidgets() => await _crmContext.Widgets.ToListAsync();
  }
}

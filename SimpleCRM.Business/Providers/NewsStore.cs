using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SimpleCRM.Business.Models;
using SimpleCRM.Data;
using SimpleCRM.Data.Entities;

namespace SimpleCRM.Business.Providers {
  
  public class NewsStore : INewsStore {

    private readonly CrmContext _crmContext;

    public NewsStore(CrmContext crmContext)
    => _crmContext = crmContext;


    public async Task AddGroup(string group) {
      await _crmContext.NewsGroups.AddAsync(new NewsGroup {
        Name = group
      });
      await _crmContext.SaveChangesAsync();
    }

    public bool GroupExists(string group) {
      return _crmContext.NewsGroups.Any(t => t.Name == group);
    }

    public void CreateNewItem(NewsItem item) {
      if (GroupExists(item.NewsGroup)) {
        _crmContext.NewsItemEntities.Add(new NewsItemEntity {
          Header = item.Header,
          Author = item.Author,
          NewsGroup = item.NewsGroup,
          NewsText = item.NewsText
        });
        _crmContext.SaveChanges();
      }
      else throw new System.Exception( "group does not exist" );
    }

    public IEnumerable<NewsItem> GetAllNewsItems(string group) {
      return _crmContext.NewsItemEntities.Where( item => item.NewsGroup == group ).Select( 
        z => new NewsItem {
          Author = z.Author,
          Header = z.Header,
          NewsGroup = z.NewsGroup,
          NewsText = z.NewsText
        }
      );
    }

    public async Task<List<string>> GetAllGroups() => await _crmContext.NewsGroups.Select(t => t.Name).ToListAsync();
  }
}

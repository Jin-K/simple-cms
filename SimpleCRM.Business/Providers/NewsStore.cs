using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SimpleCRM.Business.Models;
using SimpleCRM.Data.Contexts;
using SimpleCRM.Data.Entities;

namespace SimpleCRM.Business.Providers {
  public class NewsStore {
    public NewsStore(NewsContext newsContext) {
      _newsContext = newsContext;
    }

    private readonly NewsContext _newsContext;

    public async Task AddGroup(string group) {
      await _newsContext.NewsGroups.AddAsync(new NewsGroup {
        Name = group
      });
      await _newsContext.SaveChangesAsync();
    }

    public bool GroupExists(string group) {
      return _newsContext.NewsGroups.Any(t => t.Name == group);
    }

    public void CreateNewItem(NewsItem item) {
      if (GroupExists(item.NewsGroup)) {
        _newsContext.NewsItemEntities.Add(new NewsItemEntity {
          Header = item.Header,
          Author = item.Author,
          NewsGroup = item.NewsGroup,
          NewsText = item.NewsText
        });
        _newsContext.SaveChanges();
      }
      else throw new System.Exception( "group does not exist" );
    }

    public IEnumerable<NewsItem> GetAllNewsItems(string group) {
      return _newsContext.NewsItemEntities.Where( item => item.NewsGroup == group ).Select( 
        z => new NewsItem {
          Author = z.Author,
          Header = z.Header,
          NewsGroup = z.NewsGroup,
          NewsText = z.NewsText
        }
      );
    }

    public async Task<List<string>> GetAllGroups() => await _newsContext.NewsGroups.Select(t => t.Name).ToListAsync();
  }
}

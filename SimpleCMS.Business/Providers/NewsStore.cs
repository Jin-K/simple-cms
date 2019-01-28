using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SimpleCMS.Business.Models;
using SimpleCMS.Data;
using SimpleCMS.Data.Entities;

namespace SimpleCMS.Business.Providers {

	public class NewsStore : INewsStore {

		private readonly CmsContext _cmsContext;

		public NewsStore(CmsContext cmsContext)
		=> _cmsContext = cmsContext;


		public async Task AddGroup(string group) {
			await _cmsContext.NewsGroups.AddAsync(new NewsGroup {
				Name = group
			});
			await _cmsContext.SaveChangesAsync();
		}

		public bool GroupExists(string group) {
			return _cmsContext.NewsGroups.Any(t => t.Name == group);
		}

		public void CreateNewItem(NewsItem item) {
			if (GroupExists(item.NewsGroup)) {
				_cmsContext.NewsItemEntities.Add(new NewsItemEntity {
					Header = item.Header,
					Author = item.Author,
					NewsGroup = item.NewsGroup,
					NewsText = item.NewsText
				});
				_cmsContext.SaveChanges();
			}
            else throw new System.Exception("group does not exist");
		}

		public IEnumerable<NewsItem> GetAllNewsItems(string group) {
			return _cmsContext.NewsItemEntities.Where(item => item.NewsGroup == group).Select(
                z => new NewsItem {
                    Author = z.Author,
                    Header = z.Header,
                    NewsGroup = z.NewsGroup,
                    NewsText = z.NewsText
                }
			);
		}

		public async Task<List<string>> GetAllGroups() => await _cmsContext.NewsGroups.Select(t => t.Name).ToListAsync();
	}
}

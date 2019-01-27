using System.Collections.Generic;

namespace SimpleCMS.Business.Models {
  public class PaginatedItemList {
    public IEnumerable<Item> Items { get; internal set; }
    public long Count { get; internal set; }
  }
}

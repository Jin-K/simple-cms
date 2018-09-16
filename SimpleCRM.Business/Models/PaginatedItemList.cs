using System.Collections.Generic;

namespace SimpleCRM.Business.Models {
  public class PaginatedItemList {
    public IEnumerable<Item> Items { get; internal set; }
    public long Count { get; internal set; }
  }
}

using System;
using System.Linq;

namespace SimpleCRM.Api.Models {
  public class QueryParameters {
    const int MAX_PAGE_COUNT = 50;

    public int Page { get; set; } = 1;

    int _pageCount = MAX_PAGE_COUNT;
    public int PageCount {
      get => _pageCount;
      set => _pageCount = ( value > MAX_PAGE_COUNT ) ? MAX_PAGE_COUNT : value;
    }

    public string Query { get; set; }

    public string OrderBy { get; set; } = "Id";

    #region Helpers
    public bool Descending => !string.IsNullOrEmpty( OrderBy ) ? OrderBy.Split( ' ' ).Last().ToLowerInvariant().StartsWith( "desc" ) : false;
    public double GetTotalPages(int totalCount) => Math.Ceiling( totalCount / (double) PageCount );
    #endregion
  }
}

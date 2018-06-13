using System;

namespace SimpleCRM.Api.Models {
  public class DataEventRecordDto {
    public long Id { get; set; }
    public string Name { get; set; }

    public string Description { get; set; }

    public DateTime Timestamp { get; set; }
  }
}

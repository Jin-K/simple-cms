﻿using System;

namespace SimpleCRM.Data.Entities {
  public class DataEventRecord {
    public long Id { get; set; }
    public string Name { get; set; }
    public string Username { get; set; }
    public string Description { get; set; }
    public DateTime Timestamp { get; set; }
  }
}

﻿using System.Collections.Generic;

namespace SimpleCRM.Api.Models.EF {
  public class _Label {
    public int Id { get; set; }
    public string Label { get; set; }
    public System.DateTime Created { get; set; }
    public int Custom { get; set; }

    public List<Entity> Entities { get; set; }
  }
}
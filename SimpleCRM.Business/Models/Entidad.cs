﻿namespace SimpleCRM.Business.Models {
  public struct Entidad {
    public int Id { get; set; }
    public string Name { get; set; }
  }

  public struct Item {
    public int id { get; set; }
    public bool active { get; set; }
    public System.DateTime created { get; set; }
  }
}
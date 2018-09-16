using System;

namespace SimpleCRM.Data.Entities {
  public interface IEntidad {
    int Id { get; set; }
    DateTime Created { get; set; }
  }
}

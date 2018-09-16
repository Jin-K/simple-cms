using System;
using System.ComponentModel.DataAnnotations;

namespace SimpleCRM.Data.Entities {
  public class Action : IEntidad {

    [Key]
    public int Id { get; set; }

    [Required]
    public DateTime Created { get; set; } = System.DateTime.Now;
  }
}

using System;
using System.ComponentModel.DataAnnotations;

namespace SimpleCRM.Data.Entities {
  public class Action : IEntidad {

    [Key]
    public int Id { get; set; }

		public bool Active { get; set; } = true;

    [Required]
    public DateTime Created { get; set; } = System.DateTime.Now;
    
	}
}

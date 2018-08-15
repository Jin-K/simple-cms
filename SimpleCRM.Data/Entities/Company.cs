using System.ComponentModel.DataAnnotations;

namespace SimpleCRM.Data.Entities {
  public class Company {

    [Required, Key]
    public int Id { get; set; }

    [Required]
    public System.DateTime Created { get; set; }
  }
}

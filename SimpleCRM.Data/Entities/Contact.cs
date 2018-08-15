using System.ComponentModel.DataAnnotations;

namespace SimpleCRM.Data.Entities {
  public class Contact {

    [Required, Key]
    public int Id { get; set; }

    [Required]
    public System.DateTime Created { get; set; }
  }
}

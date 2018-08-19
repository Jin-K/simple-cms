using System.ComponentModel.DataAnnotations;

namespace SimpleCRM.Data.Entities {
  public class Contact {

    [Key]
    public int Id { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    [Required]
    public System.DateTime Created { get; set; } = System.DateTime.Now;
  }
}

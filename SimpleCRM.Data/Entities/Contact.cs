using System.ComponentModel.DataAnnotations;

namespace SimpleCRM.Data.Entities {
  public class Contact : IEntidad {

    [Key]
    public int Id { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    [Required]
    public System.DateTime Created { get; set; } = System.DateTime.Now;
  }
}

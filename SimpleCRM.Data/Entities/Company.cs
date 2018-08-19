using System.ComponentModel.DataAnnotations;

namespace SimpleCRM.Data.Entities {
  public class Company {

    [Key]
    public int Id { get; set; }

    public string Name { get; set; }

    [Required]
    public System.DateTime Created { get; set; } = System.DateTime.Now;
  }
}

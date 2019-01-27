using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SimpleCMS.Data.Entities {

  [Table( "Accounts" )]
  public class Account {

    [Required, Key]
    public int Id { get; set; }

    [Required]
    public string UserCode { get; set; }

    [Required]
    public string Login { get; set; }

    public string FullName { get; set; }

    [Required]
    public System.DateTime Created { get; set; } = System.DateTime.Now;

    public System.DateTime? LastConnection { get; set; }

    [Required]
    public int Type { get; set; }

  }

}

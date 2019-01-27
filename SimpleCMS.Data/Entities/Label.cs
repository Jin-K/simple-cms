using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SimpleCMS.Data.Entities {

	[Table( "Labels" )]
  public class _Label {

    [Required, Key]
    public int Id { get; set; }

    [Required]
    public string Label { get; set; }

    [Required]
    public System.DateTime Created { get; set; } = System.DateTime.Now;

    [Required]
    public int Custom { get; set; }

    [InverseProperty( "Label" )]
    public ICollection<Entity> Entities { get; set; }

  }

}

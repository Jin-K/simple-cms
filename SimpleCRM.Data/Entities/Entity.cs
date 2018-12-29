using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SimpleCRM.Data.Entities {

	[Table( "Entities" )]
  public class Entity {

    [Required, Key, DatabaseGenerated( DatabaseGeneratedOption.None )]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    [Required]
    public System.DateTime Created { get; set; } = System.DateTime.Now;

    [Required]
    public int Custom { get; set; }
    
    public int? LabelId { get; set; }

    [ForeignKey( "LabelId" )]
    [InverseProperty( "Entities" )]
    public _Label Label { get; set; }

  }

}

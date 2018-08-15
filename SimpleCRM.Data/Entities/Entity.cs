using System.ComponentModel.DataAnnotations.Schema;

namespace SimpleCRM.Data.Entities {
  public class Entity {
    public int Id { get; set; }
    public string Name { get; set; }
    public System.DateTime Created { get; set; }
    public int Custom { get; set; }
    public int? LabelId { get; set; }

    [ForeignKey("LabelId")]
    public _Label Label { get; set; }
  }
}

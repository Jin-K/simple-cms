using SimpleCRM.Api.Models.ViewModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SimpleCRM.Api.Models.EF {
  public class Entity {
    [Key]
    public int Id { get; set; }
    public string Name { get; set; }
    public string Value { get; set; }
    public System.DateTime Created { get; set; }
    public int Custom { get; set; }
    public int? LabelId { get; set; }

    [ForeignKey("LabelId")]
    public _Label Label { get; set; }

    internal Entidad ToEntidad() => new Entidad { Id = Id, Name = Name };
  }
}

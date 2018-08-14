using SimpleCRM.Api.Models.ViewModel;

namespace SimpleCRM.Api.Models.EF {
  public class Entity {
    public int Id { get; set; }
    public string Name { get; set; }
    public System.DateTime Created { get; set; }
    public int Custom { get; set; }
    public int? LabelId { get; set; }
    
    public _Label Label { get; set; }

    internal Entidad ToEntidad() => new Entidad { Id = Id, Name = Name };
  }
}

namespace SimpleCRM.Api.Models {
  public class Entity {
    public int Id { get; set; }
    public string Name { get; set; }
    public string Value { get; set; }
    public System.DateTime Created { get; set; }
    public int Custom { get; set; }
    public int? LabelId { get; set; }
  }
}

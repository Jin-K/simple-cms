namespace SimpleCRM.Api.Models {
  public struct Entidad {
    public int Id { get; set; }
    public string Name { get; set; }

    public static implicit operator Entidad(Entity entity) => new Entidad { Id = entity.Id, Name = entity.Name };
  }
}

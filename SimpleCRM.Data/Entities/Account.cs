namespace SimpleCRM.Data.Entities {
  public class Account {
    public int Id { get; set; }
    public string UserCode { get; set; }
    public string Login { get; set; }
    public string FullName { get; set; }
    public System.DateTime Created { get; set; }
    public System.DateTime LastConnection { get; set; }
    public int Type { get; set; }
  }
}

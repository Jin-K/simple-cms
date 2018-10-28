namespace SimpleCRM.Auth.Configuration {
  public class IdentityServerConfiguration {
    public string[] RedirectUris { get; set; }
    public string[] PostLogoutRedirectUris { get; set; }
    public string[] AllowedCorsOrigins { get; set; }
  }
}

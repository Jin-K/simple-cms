namespace SimpleCMS.Auth.Configuration {
	public class IdentityServerConfiguration {
		public string[] RedirectUris { get; set; }
		public string[] AllowedCorsOrigins { get; set; }
		public string IssuerUri { get; set; }
		public string[] CustomSources { get; set; }
		public string Origin { get; set; }
	}
}

using IdentityModel;

namespace System.Security.Claims {

  public static partial class CustomExtensions {

    public static string GetClaim(this ClaimsPrincipal principal, string claimType)
    => principal?.FindFirst( claimType )?.Value;

    public static string GetSub(this ClaimsPrincipal principal)
    => principal?.GetClaim( JwtClaimTypes.Subject );

    public static string GetEmail(this ClaimsPrincipal principal)
    => principal?.GetClaim( JwtClaimTypes.Email );
    
  }  

}

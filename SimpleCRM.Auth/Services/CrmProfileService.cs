using IdentityModel;
using IdentityServer4.Extensions;
using IdentityServer4.Models;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Identity;
using SimpleCRM.Data.Entities;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SimpleCRM.Auth.Services {
  public class CrmProfileService : IProfileService {
    private readonly IUserClaimsPrincipalFactory<AppUser> _claimsFactory;
    private readonly UserManager<AppUser> _userManager;

    public CrmProfileService(UserManager<AppUser> userManager, IUserClaimsPrincipalFactory<AppUser> claimsFactory) {
      _userManager = userManager;
      _claimsFactory = claimsFactory;
    }

    public async Task GetProfileDataAsync(ProfileDataRequestContext context) {
      var sub = context.Subject.GetSubjectId();

      var user = await _userManager.FindByIdAsync( sub );
      var principal = await _claimsFactory.CreateAsync( user );

      var claims = principal.Claims.ToList();

      claims = claims.Where( claim => context.RequestedClaimTypes.Contains( claim.Type ) ).ToList();


      claims.Add( new Claim( JwtClaimTypes.GivenName, user.UserName ) );


      if (user.IsAdmin) {
        claims.Add( new Claim( JwtClaimTypes.Role, "admin" ) );
      }
      else {
        claims.Add( new Claim( JwtClaimTypes.Role, "user" ) );
      }

      if (user.DataEventRecordsRole == "dataEventRecords.admin") {
        claims.Add( new Claim( JwtClaimTypes.Role, "dataEventRecords.admin" ) );
        claims.Add( new Claim( JwtClaimTypes.Role, "dataEventRecords.user" ) );
        claims.Add( new Claim( JwtClaimTypes.Role, "dataEventRecords" ) );
        claims.Add( new Claim( JwtClaimTypes.Scope, "dataEventRecords" ) );
      }
      else {
        claims.Add( new Claim( JwtClaimTypes.Role, "dataEventRecords.user" ) );
        claims.Add( new Claim( JwtClaimTypes.Role, "dataEventRecords" ) );
        claims.Add( new Claim( JwtClaimTypes.Scope, "dataEventRecords" ) );
      }

      claims.Add( new Claim( JwtClaimTypes.Name, user.Email ) );
      claims.Add( new Claim( JwtClaimTypes.Email, user.Email ) );

      context.IssuedClaims = claims;
    }

    public async Task IsActiveAsync(IsActiveContext context) {
      var sub = context.Subject.GetSubjectId();
      var user = await _userManager.FindByIdAsync( sub );
      context.IsActive = user != null;
    }
  }
}

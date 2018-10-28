using Microsoft.AspNetCore.Mvc;
using SimpleCRM.Auth.Controllers;

namespace SimpleCRM.Auth.Extensions {
  public static class UrlHelperExtensions {
    public static string EmailConfirmationLink(this IUrlHelper urlHelper, int userId, string code, string scheme) {
      return urlHelper.Action(
          action: nameof(AccountController.ConfirmEmail),
          controller: "Account",
          values: new { userId, code },
          protocol: scheme);
    }

    public static string ResetPasswordCallbackLink(this IUrlHelper urlHelper, int userId, string code, string scheme) {
      return urlHelper.Action(
          action: nameof(AccountController.ResetPassword),
          controller: "Account",
          values: new { userId, code },
          protocol: scheme);
    }
  }
}

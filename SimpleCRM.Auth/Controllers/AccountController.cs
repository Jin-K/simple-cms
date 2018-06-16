using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SimpleCRM.Auth.Models;
using SimpleCRM.Auth.Models.AccountViewModels;

namespace SimpleCRM.Auth.Controllers {
  public class AccountController : Controller {
    readonly SignInManager<ApplicationUser> _signInManager;
    readonly ILogger<AccountController> _logger;

    public AccountController(
      SignInManager<ApplicationUser> signInManager,
      ILogger<AccountController> logger
    ) {
      _signInManager = signInManager;
      _logger = logger;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> Login(string returnUrl = null) {
      // Clear the existent external cookie to ensure a clean login process
      await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);

      ViewData["ReturnUrl"] = returnUrl;
      return View();
    }

    [HttpPost]
    [AllowAnonymous]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Login(Models.AccountViewModels.LoginViewModel model, string returnUrl = null) {
      ViewData["ReturnUrl"] = returnUrl;

      if (ModelState.IsValid) {
        // This doesn't count login failures towards account lockout
        // To enable password failures to trigger account lockout, set lockoutOnFailure: true
        var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, lockoutOnFailure: false);
        if (result.Succeeded) {
          _logger.LogInformation("User logged in.");
          return RedirectToLocal(returnUrl);
        }
        if (result.RequiresTwoFactor) return RedirectToAction(nameof(LoginWith2fa), new { returnUrl, model.RememberMe });
        if (result.IsLockedOut) {
          _logger.LogWarning("User account locked out.");
          return RedirectToAction(nameof(Lockout));
        }
        else {
          ModelState.AddModelError(string.Empty, "Invalid login attempt.");
          return View(model);
        }
      }

      // If we got this far, something failed, redisplay form
      return View(model);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> LoginWith2fa(bool rememberMe, string returnUrl = null) {
      // Ensure the user has gone through the username & password screen first
      var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();

      if (user == null) {
        throw new ApplicationException( $"Unable to load two-factor authentication user." );
      }

      var model = new LoginWith2faViewModel { RememberMe = rememberMe };
      ViewData["ReturnUrl"] = returnUrl;

      return View(model);
    }

    [HttpGet]
    [AllowAnonymous]
    public IActionResult Lockout() {
      return View();
    }

    #region Helpers
    IActionResult RedirectToLocal(string returnUrl) =>
      Url.IsLocalUrl(returnUrl) ? Redirect(returnUrl) : RedirectToAction(nameof(HomeController.Index), "Home") as IActionResult;
    #endregion
  }
}
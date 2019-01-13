using IdentityModel;
using IdentityServer4;
using IdentityServer4.Extensions;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SimpleCRM.Auth.Extensions;
using SimpleCRM.Auth.Models.AccountViewModels;
using SimpleCRM.Auth.Services;
using SimpleCRM.Data.Entities;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SimpleCRM.Auth.Controllers {
  public class AccountController : Controller {
    readonly SignInManager<AppUser> _signInManager;
    readonly ILogger<AccountController> _logger;
    readonly UserManager<AppUser> _userManager;
    readonly IEmailSender _emailSender;

    readonly IIdentityServerInteractionService _interaction;
    readonly IPersistedGrantService _persistedGrantService;

    [TempData]
    public string ErrorMessage { get; set; }

    public AccountController(
      UserManager<AppUser> userManager,
      SignInManager<AppUser> signInManager,
      IEmailSender emailSender,
      ILogger<AccountController> logger,
      IPersistedGrantService persistedGrantService,
      IIdentityServerInteractionService interaction
    ) {
      _userManager = userManager;
      _signInManager = signInManager;
      _emailSender = emailSender;
      _logger = logger;

      _persistedGrantService = persistedGrantService;
      _interaction = interaction;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> Login(string returnUrl = null) {
      // Clear the existent external cookie to ensure a clean login process
      await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);

      ViewData["ReturnUrl"] = returnUrl;
      ViewData["ValidationErrors"] = new string[0];
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
          ViewData["ValidationErrors"] = new []{ "Invalid login attempt." };
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

      if (user == null) throw new ApplicationException( $"Unable to load two-factor authentication user." );

      var model = new LoginWith2faViewModel { RememberMe = rememberMe };
      ViewData["ReturnUrl"] = returnUrl;

      return View(model);
    }

    [HttpGet]
    [AllowAnonymous]
    public IActionResult Lockout() => View();

    [HttpGet]
    [AllowAnonymous]
    public IActionResult Register(string returnUrl = null) {
      ViewData["ReturnUrl"] = returnUrl;
      return View();
    }

    [HttpPost]
    [AllowAnonymous]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Register(RegisterViewModel model, string returnUrl = null) {
      ViewData["ReturnUrl"] = returnUrl;
      if (ModelState.IsValid) {
        var user = new AppUser { UserName = model.Email, Email = model.Email };
        var result = await _userManager.CreateAsync(user, model.Password);
        if (result.Succeeded) {
          _logger.LogInformation("User created a new account with password.");

          var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
          var callbackUrl = Url.EmailConfirmationLink(user.Id, code, Request.Scheme);
          await _emailSender.SendEmailConfirmationAsync(model.Email, callbackUrl);

          await _signInManager.SignInAsync(user, isPersistent: false);
          _logger.LogInformation("User created a new account with password.");
          return RedirectToLocal(returnUrl);
        }
        AddErrors(result);
      }

      // If we got this far, something failed, redisplay form
      return View(model);
    }

    /// <summary>
    /// Show logout page
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> Logout(string logoutId) {
      if (User.Identity.IsAuthenticated == false) {
        // if the user is not authenticated, then just show logged out page
        return await Logout(new LogoutViewModel { LogoutId = logoutId });
      }

      var context = await _interaction.GetLogoutContextAsync(logoutId);
      if (context?.ShowSignoutPrompt == false) {
        // it's safe to automatically sign-out
        return await Logout(new LogoutViewModel { LogoutId = logoutId });
      }

      // show the logout prompt. this prevents attacks where the user
      // is automatically signed out by another malicious web page.
      var vm = new LogoutViewModel {
        LogoutId = logoutId
      };

      return View(vm);
    }

    /// <summary>
    /// Handle logout page postback
    /// </summary>
    [HttpPost]
    [ValidateAntiForgeryToken]
    [AllowAnonymous]
    public async Task<IActionResult> Logout(LogoutViewModel model) {
      var idp = User?.FindFirst(JwtClaimTypes.IdentityProvider)?.Value;
      var subjectId = HttpContext.User.Identity.GetSubjectId();

      if (idp != null && idp != IdentityServerConstants.LocalIdentityProvider) {
        if (model.LogoutId == null) {
          // if there's no current logout context, we need to create one
          // this captures necessary info from the current logged in user
          // before we signout and redirect away to the external IdP for signout
          model.LogoutId = await _interaction.CreateLogoutContextAsync();
        }

        string url = "/Account/Logout?logoutId=" + model.LogoutId;
        try {
          await _signInManager.SignOutAsync();
          // await HttpContext.Authentication.SignOutAsync(idp, new AuthenticationProperties { RedirectUri = url });
        } catch (NotSupportedException) {
        }
      }

      // delete authentication cookie
      await _signInManager.SignOutAsync();

      // set this so UI rendering sees an anonymous user
      HttpContext.User = new ClaimsPrincipal(new ClaimsIdentity());

      // get context information (client name, post logout redirect URI and iframe for federated signout)
      var logout = await _interaction.GetLogoutContextAsync(model.LogoutId);

      var vm = new LoggedOutViewModel {
        PostLogoutRedirectUri = logout?.PostLogoutRedirectUri,
        ClientName = logout?.ClientId,
        SignOutIframeUrl = logout?.SignOutIFrameUrl
      };

      await _persistedGrantService.RemoveAllGrantsAsync(subjectId, "angular2client");

      return View("LoggedOut", vm);
    }

    [HttpPost]
    [AllowAnonymous]
    [ValidateAntiForgeryToken]
    public IActionResult ExternalLogin(string provider, string returnUrl = null) {
      // Request a redirect to the external login provider.
      var redirectUrl = Url.Action(nameof(ExternalLoginCallback), "Account", new { returnUrl });
      var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
      return Challenge(properties, provider);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> ExternalLoginCallback(string returnUrl = null, string remoteError = null) {
      if (remoteError != null) {
        ErrorMessage = $"Error from external provider: {remoteError}";
        return RedirectToAction(nameof(Login));
      }
      var info = await _signInManager.GetExternalLoginInfoAsync();
      if (info == null) {
        return RedirectToAction(nameof(Login));
      }

      // Sign in the user with this external login provider if the user already has a login.
      var result = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: false, bypassTwoFactor: false);
      if (result.Succeeded) {
        _logger.LogInformation("User logged in with {Name} provider.", info.LoginProvider);
        return RedirectToLocal(returnUrl);
      }
      if (result.RequiresTwoFactor) {
        return RedirectToAction(nameof(LoginWith2fa), new { returnUrl });
      }
      if (result.IsLockedOut) {
        return RedirectToAction(nameof(Lockout));
      } else {
        // If the user does not have an account, then ask the user to create an account.
        ViewData["ReturnUrl"] = returnUrl;
        ViewData["LoginProvider"] = info.LoginProvider;
        var email = info.Principal.FindFirstValue(ClaimTypes.Email);
        return View("ExternalLogin", new ExternalLoginViewModel { Email = email });
      }
    }

    [HttpPost]
    [AllowAnonymous]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ExternalLoginConfirmation(ExternalLoginViewModel model, string returnUrl = null) {
      if (ModelState.IsValid) {
        // Get the information about the user from the external login provider
        var info = await _signInManager.GetExternalLoginInfoAsync();
        if (info == null) {
          throw new ApplicationException("Error loading external login information during confirmation.");
        }
        var user = new AppUser { UserName = model.Email, Email = model.Email };
        var result = await _userManager.CreateAsync(user);
        if (result.Succeeded) {
          result = await _userManager.AddLoginAsync(user, info);
          if (result.Succeeded) {
            await _signInManager.SignInAsync(user, isPersistent: false);
            _logger.LogInformation("User created an account using {Name} provider.", info.LoginProvider);
            return RedirectToLocal(returnUrl);
          }
        }
        AddErrors(result);
      }

      ViewData["ReturnUrl"] = returnUrl;
      return View(nameof(ExternalLogin), model);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> ConfirmEmail(string userId, string code) {
      if (userId == null || code == null) return RedirectToAction(nameof(HomeController.Index), "Home");
      var user = await _userManager.FindByIdAsync(userId);
      if (user == null) throw new ApplicationException($"Unable to load user with ID '{userId}'.");
      var result = await _userManager.ConfirmEmailAsync(user, code);
      return View(result.Succeeded ? "ConfirmEmail" : "Error");
    }

    [HttpGet]
    [AllowAnonymous]
    public IActionResult ForgotPassword() => View();

    [HttpPost]
    [AllowAnonymous]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordViewModel model) {
      if (ModelState.IsValid) {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null || !(await _userManager.IsEmailConfirmedAsync(user))) {
          // Don't reveal that the user does not exist or is not confirmed
          return RedirectToAction(nameof(ForgotPasswordConfirmation));
        }

        // For more information on how to enable account confirmation and password reset please
        // visit https://go.microsoft.com/fwlink/?LinkID=532713
        var code = await _userManager.GeneratePasswordResetTokenAsync(user);
        var callbackUrl = Url.ResetPasswordCallbackLink(user.Id, code, Request.Scheme);
        await _emailSender.SendEmailAsync(model.Email, "Reset Password",
           $"Please reset your password by clicking here: <a href='{callbackUrl}'>link</a>");
        return RedirectToAction(nameof(ForgotPasswordConfirmation));
      }

      // If we got this far, something failed, redisplay form
      return View(model);
    }

    [HttpGet]
    [AllowAnonymous]
    public IActionResult ForgotPasswordConfirmation() => View();

    [HttpGet]
    [AllowAnonymous]
    public IActionResult ResetPassword(string code = null) {
      if (code == null) throw new ApplicationException("A code must be supplied for password reset.");
      var model = new ResetPasswordViewModel { Code = code };
      return View(model);
    }

    [HttpPost]
    [AllowAnonymous]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ResetPassword(ResetPasswordViewModel model) {
      if (!ModelState.IsValid) return View(model);
      var user = await _userManager.FindByEmailAsync(model.Email);
      if (user == null) {
        // Don't reveal that the user does not exist
        return RedirectToAction(nameof(ResetPasswordConfirmation));
      }
      var result = await _userManager.ResetPasswordAsync(user, model.Code, model.Password);
      if (result.Succeeded) return RedirectToAction(nameof(ResetPasswordConfirmation));
      AddErrors(result);
      return View();
    }

    [HttpGet]
    [AllowAnonymous]
    public IActionResult ResetPasswordConfirmation() => View();


    [HttpGet]
    public IActionResult AccessDenied() => View();

    /// <summary>
    /// Not implemented
    /// </summary>
    /// <returns>Exception</returns>
    public IActionResult LoginWithRecoveryCode()
    => throw new NotImplementedException();

    #region Helpers
    private void AddErrors(IdentityResult result) {
      foreach (var error in result.Errors) ModelState.AddModelError(string.Empty, error.Description);
    }

    IActionResult RedirectToLocal(string returnUrl) =>
      Url.IsLocalUrl(returnUrl) ? Redirect(returnUrl) : RedirectToAction(nameof(HomeController.Index), "Home") as IActionResult;
    #endregion
  }
}

using System.ComponentModel.DataAnnotations;

namespace SimpleCMS.Auth.Models.AccountViewModels {
  public class ForgotPasswordViewModel {
    [Required]
    [EmailAddress]
    public string Email { get; set; }
  }
}

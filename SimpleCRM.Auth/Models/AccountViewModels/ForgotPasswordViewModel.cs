using System.ComponentModel.DataAnnotations;

namespace SimpleCRM.Auth.Models.AccountViewModels {
  public class ForgotPasswordViewModel {
    [Required]
    [EmailAddress]
    public string Email { get; set; }
  }
}

using System.ComponentModel.DataAnnotations;

namespace SimpleCMS.Auth.Models.AccountViewModels {
  public class ExternalLoginViewModel {
    [Required]
    [EmailAddress]
    public string Email { get; set; }
  }
}

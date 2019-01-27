using System.ComponentModel.DataAnnotations;

namespace SimpleCMS.Auth.Models.AccountViewModels
{
    public class LoginWithRecoveryCodeViewModel
    {
        [Required(ErrorMessage = "ACCOUNT_RECOVERY_CODE_REQUIRED")] 
        [DataType(DataType.Text)] 
        public string RecoveryCode { get; set; }
    }
}
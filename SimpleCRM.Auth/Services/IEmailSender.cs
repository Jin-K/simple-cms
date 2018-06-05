using System.Threading.Tasks;

namespace SimpleCRM.Auth.Services {
  public interface IEmailSender {
    Task SendEmailAsync(string email, string subject, string message);
  }
}

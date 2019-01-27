using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace SimpleCMS.Auth.Services {
  public class AuthMessageSender : IEmailSender {
    private readonly ILogger<AuthMessageSender> _logger;

    public AuthMessageSender(ILogger<AuthMessageSender> logger) {
      _logger = logger;
    }

    public Task SendEmailAsync(string email, string subject, string message) {
      _logger.LogInformation( "Email: {email}, Subject: {subject}, Message: {message}", email, subject, message );
      return Task.FromResult( 0 );
    }
  }
}

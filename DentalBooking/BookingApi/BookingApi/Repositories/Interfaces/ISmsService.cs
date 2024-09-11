using System.Threading.Tasks;

public interface ISmsService
{
    Task<string> SendSmsAsync(string toPhoneNumber, string message);
    Task<string> SendOTPCodeBySMS(string phoneNumber);
    string GenerateOTP();
}
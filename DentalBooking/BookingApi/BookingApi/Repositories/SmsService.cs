using BookingApi.Repositories.Interfaces;
using Twilio;
using Twilio.Rest.Api.V2010.Account;

public class SmsService : ISmsService
{
    private readonly string accountSid;
    private readonly string authToken;
    private readonly string senderPhoneNumber;

    public SmsService(string accountSid, string authToken, string senderPhoneNumber)
    {
        this.accountSid = accountSid;
        this.authToken = authToken;
        this.senderPhoneNumber = senderPhoneNumber;
    }

    public async Task<string> SendSmsAsync(string toPhoneNumber, string message)
    {
        TwilioClient.Init(accountSid, authToken);
        var messageResource = await MessageResource.CreateAsync(
            body: message,
            from: new Twilio.Types.PhoneNumber(senderPhoneNumber),
            to: new Twilio.Types.PhoneNumber(toPhoneNumber)
        );
        return messageResource.Sid;
    }

    public string GenerateOTP()
    {
        Random rnd = new Random();
        int otp = rnd.Next(100000, 999999);
        return otp.ToString();
    }

    public async Task<string> SendOTPCodeBySMS(string phoneNumber)
    {
        string otp = GenerateOTP();
        string message = "Your OTP code is: " + otp;

        try
        {
            string sid = await SendSmsAsync(phoneNumber, message);
            return otp;
        }
        catch (Exception ex)
        {
            // Handle the exception here
            throw ex;
        }
    }
}

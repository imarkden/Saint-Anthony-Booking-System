using BookingApi.Models;

namespace BookingApi.Utility
{
    public interface IEmailService
    {
        void SendEmail(Email email);
    }
}

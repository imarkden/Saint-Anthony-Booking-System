using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
namespace BookingApi.Models
{
    public class Admin
    {
        [Key]
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Username { get; set; }
        public string? Phone { get; set; }
        public string? Password { get; set; }
        public string? Token { get; set; }
        public string? Role { get; set; }
        public string? OTP { get; set; }
        public DateTime OTPGeneratedTime { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
        public string? ResetPasswordToken { get; set; }
        public DateTime ResetPasswordTokenExpiryTime { get; set;}
    }
}

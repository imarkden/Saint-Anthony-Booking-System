using System.ComponentModel.DataAnnotations;

namespace BookingApi.Models.DTO
{
    public class CreateGuestDto
    {
        public int Id { get; set; }
 
        public string Name { get; set; }

        public string Phone { get; set; }

        public DateTime SelectedDate { get; set; }
        public string? SelectedTime { get; set; }
        public string? OTP { get; set; }
        public DateTime OTPGeneratedTime { get; set; }
    }

}
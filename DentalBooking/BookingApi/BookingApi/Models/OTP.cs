namespace BookingApi.Models
{
    public class OTP
    {
        public int Id { get; set; }
        public string? Code { get; set; }
        public DateTime? ExpirationTime { get; set; }
    }

}
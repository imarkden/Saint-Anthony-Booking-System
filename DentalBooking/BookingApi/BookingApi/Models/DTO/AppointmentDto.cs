namespace BookingApi.Models.DTO
{
    public class AppointmentDTO
    {
        public string? Name { get; set; }
        public string? Phone { get; set; }
        public int? SelectedDoctorId { get; set; }
        public int? SelectedServiceId { get; set; }
        public DateTime SelectedDate { get; set; }
        public TimeSpan SelectedTime { get; set; }
        public double? Cost { get; set; }
        public string? Note { get; set; }
        public string? OTP { get; set; }
        public string? Status { get; set; }
    }
}

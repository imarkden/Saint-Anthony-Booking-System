
namespace BookingApi.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        public string? Phone { get; set; }
        public string? Name { get; set; }
        public int? Age { get; set; }
        public string? Gender { get; set; }
        public string? SelectedDoctor { get; set; }
        public string? SelectedService { get; set; }
        public DateTime SelectedDate { get; set; }
        public string? SelectedTime { get; set; }
        public int? Duration { get; set; }
        public string? EndTime { get; set; }
        public double? Cost { get; set; }
        public double? AdditionalCost { get; set; }
        public double? TotalAmount { get; set; }
        public string? Note { get; set; }
        public string? Notification { get; set; }
        public string? Reminded { get; set; }
        public string? Status { get; set; }
    }
}

namespace BookingApi.Models
{
    public class Guest
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Phone { get; set; }
        public int? Age { get; set; }
        public string? Gender { get; set; }
        public string? Service { get; set; }
        public DateTime SelectedDate { get; set; }
        public string? SelectedTime { get; set; }
        public string? EndTime { get; set; }
        public string? CancelReason { get; set; }
        public string? Status { get; set; }
        public string? Reminded { get; set; }
        public string? Notification { get; set; }
    }

}

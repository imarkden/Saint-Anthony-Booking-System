namespace BookingApi.Models
{
    public class Doctor
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public DateTime Birthdate { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Gender { get; set;}
        public string? Username { get; set; }
        public string? Password { get; set; }
    }
}

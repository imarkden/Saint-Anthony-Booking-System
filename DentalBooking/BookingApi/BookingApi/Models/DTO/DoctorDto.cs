namespace BookingApi.Models.DTO
{
    public class DoctorDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int? Slots { get; set; }
        public string? Description { get; set; }
        public byte[]? Image { get; set; }
    }
}

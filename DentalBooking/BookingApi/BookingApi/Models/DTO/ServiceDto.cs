namespace BookingApi.Models.DTO
{
    public class ServiceDTO
    {
        public int Id { get; set; }
        public string? ServiceName { get; set; }
        public double? Cost { get; set; }
        public string Duration { get; set; }
        public string? Description { get; set; }
        public byte[]? Image { get; set; }
    }
}

namespace BookingApi.Models.DTO
{
    public record ResetPasswordDto
    {
        public string Phone { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set; }
    }
}

using BookingApi.Models;
using BookingApi.Models.DTO;
using Microsoft.EntityFrameworkCore;

namespace BookingApi.Repositories.Interfaces
{
    public interface IGuestRepository
    {
        Task<int> CreateGuestAsync(Guest guest);
        Task<List<Guest>> GetAllGuests();
        //Task CheckGuestAndSendReminder();
        Task CheckGuestAndFail();
        Task UpdateGuest(Guest guest);
        Task<IEnumerable<Guest>> GetSuccessGuestsAsync();
        Task<IEnumerable<Guest>> GetOngoingGuestsAsync();
        Task<IEnumerable<Guest>> GetCancelGuestsAsync();
        Task<IEnumerable<Guest>> GetFailGuestsAsync();
        Task<IEnumerable<Guest>> GetPendingGuestsAsync();
        Task<IEnumerable<Guest>> GetGuestHistoryAsync();
        Task<IEnumerable<Guest>> GetAvailableSlotsAsync();
        Task<IEnumerable<Guest>> GetYearAndMonth(int year, int month);
        Task<IEnumerable<Guest>> GetYear(int year);
        Task<Guest> GetGuestByPhoneAsync(string phone);
        Task<Guest> GetGuestById(int id);
        Task DeleteGuestAsync(int id);
        Task<Guest> UpdateGuestStatusSuccessAsync(int id);
        Task<Guest> UpdateGuestStatusConfirmAsync(int id);
        Task<Guest> UpdateGuestStatusCancelAsync(int id);
        Task<(IEnumerable<Guest> guests, DateTime currentDate)> GetTodayGuestsAsync();
    }
}

using BookingApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingApi.Repositories.Interfaces
{
    public interface IAppointmentRepository
    {
        Task<List<Appointment>> GetAllAppointments();
        Task<int> CreateAppointment(Appointment appointment);
        Task UpdateAppointment(Appointment appointment);
        Task<Appointment> GetAppointmentById(int id);
        Task<Appointment> DeleteAppointment(int id);
        Task<Appointment> CancelAppointment(int id);
        //Task CheckAndSendReminder();
        Task CheckAndFail();
        Task<IEnumerable<Appointment>> GetSuccessGuestsAsync();
        Task<IEnumerable<Appointment>> GetCancelGuestsAsync();
        Task<IEnumerable<Appointment>> GetFailAppointmentAsync();
        Task<IEnumerable<Appointment>> GetOngoingGuestsAsync();
        Task<IEnumerable<Appointment>> GetGuestHistoryAsync();
        Task<IEnumerable<Appointment>> GetGuestUnsuccessfulAsync();
        Task<IEnumerable<Appointment>> GetYearAndMonth(int year, int month);
        Task<IEnumerable<Appointment>> GetSuccessYearAndMonth(int year, int month, string status);
        Task<IEnumerable<Appointment>> GetYear(int year);
        Task<(IEnumerable<Appointment> appointments, DateTime currentDate)> GetTodayAppointmentsAsync();
        Task<Appointment> UpdateGuestStatusSuccessAsync(int id);
        Task<Appointment> UpdateAppointmentStatusCancelAsync(int id);
    }
}

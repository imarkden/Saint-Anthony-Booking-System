using BookingApi.Models;
using BookingApi.Models.DTO;
using Microsoft.EntityFrameworkCore;

namespace BookingApi.Repositories.Interfaces
{
    public interface IDoctorRepository
    {
        Task<IEnumerable<Doctor>> GetDoctorsAsync();
        Task<Doctor> GetDoctorByIdAsync(int id);
        Task AddDoctorAsync(Doctor person);
        Task UpdateDoctorAsync(Doctor person);
        Task DeleteDoctorAsync(int id);
        Doctor Authenticate(string username, string password);
        Task<Doctor> GetDoctorByUsernameAsync(string username);
    }

}

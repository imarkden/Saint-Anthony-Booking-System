using BookingApi.Models;

namespace BookingApi.Repositories.Interfaces
{
    public interface IAdminRepository
    {
        Task<Admin> GetAdminByUsernameAsync(string username);
        Task<bool> UpdateAdminAsync(Admin admin);
        Task<Admin> GetAdminByIdAsync(int id);

    }
}

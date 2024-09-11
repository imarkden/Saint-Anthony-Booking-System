using BookingApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingApi.Repositories
{
    public interface IServiceRepository
    {
        Task<IEnumerable<Service>> GetServicesAsync();
        Task<Service> GetServiceByIdAsync(int id);
        Task AddServiceAsync(Service service);
        Task UpdateServiceAsync(Service service);
        Task DeleteServiceAsync(int id);
    }
}

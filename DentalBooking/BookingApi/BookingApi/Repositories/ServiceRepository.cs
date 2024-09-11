using BookingApi.Context;
using BookingApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookingApi.Repositories
{
    public class ServiceRepository : IServiceRepository
    {

        private readonly AppDbContext _dbContext;

        public ServiceRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Service>> GetServicesAsync()
        {
            return await _dbContext.Services.ToListAsync();
        }

        public async Task<Service> GetServiceByIdAsync(int id)
        {
            return await _dbContext.Services.FindAsync(id);
        }

        public async Task AddServiceAsync(Service service)
        {
            _dbContext.Services.Add(service);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateServiceAsync(Service service)
        {
            _dbContext.Entry(service).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteServiceAsync(int id)
        {
            var service = await GetServiceByIdAsync(id);
            _dbContext.Services.Remove(service);
            await _dbContext.SaveChangesAsync();
        }
    }
}

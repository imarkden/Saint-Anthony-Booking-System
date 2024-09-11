using BookingApi.Context;
using BookingApi.Models;
using BookingApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookingApi.Repositories
{
    public class DoctorRepository : IDoctorRepository
    {
        private readonly AppDbContext _dbContext;

        public DoctorRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddDoctorAsync(Doctor doctor)
        {
            _dbContext.Doctors.Add(doctor);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteDoctorAsync(int id)
        {
            var doctor = await GetDoctorByIdAsync(id);
            _dbContext.Doctors.Remove(doctor);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<Doctor> GetDoctorByIdAsync(int id)
        {
            return await _dbContext.Doctors.FindAsync(id);
        }

        public async Task<IEnumerable<Doctor>> GetDoctorsAsync()
        {
            return await _dbContext.Doctors.ToListAsync();
        }

        public async Task UpdateDoctorAsync(Doctor doctor)
        {
            _dbContext.Entry(doctor).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
        }

        public Doctor Authenticate(string username, string password)
        {
            var doctor = _dbContext.Doctors.SingleOrDefault(x => x.Username == username && x.Password == password);
            return doctor;
        }

        public async Task<Doctor> GetDoctorByUsernameAsync(string username)
        {
            var doctor = await _dbContext.Doctors.SingleOrDefaultAsync(x => x.Username == username);
            return doctor;
        }
    }
}

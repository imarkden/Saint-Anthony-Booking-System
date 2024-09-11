using BookingApi.Context;
using BookingApi.Models;
using BookingApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Numerics;

namespace BookingApi.Repositories
{
    public class AdminRepository : IAdminRepository
    {
        private readonly AppDbContext _context;

        public AdminRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<Admin> GetAdminByUsernameAsync(string username)
        {
            return await _context.Admins.FirstOrDefaultAsync(a => a.Username == username);
        }
        public async Task<bool> UpdateAdminAsync(Admin admin)
        {
            _context.Entry(admin).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AdminExists(admin.Id))
                {
                    return false;
                }
                else
                {
                    throw;
                }
            }
            return true;
        }

        public async Task<Admin> GetAdminByIdAsync(int id)
        {
            return await _context.Admins.FindAsync(id);
        }

        private bool AdminExists(int id)
        {
            return _context.Doctors.Any(e => e.Id == id);
        }
    }
}

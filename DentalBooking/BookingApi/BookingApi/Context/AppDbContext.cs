using BookingApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BookingApi.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        public DbSet<Admin> Admins { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Guest> Guests { get; set; }
        public DbSet<OTP> OTPs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Admin>().ToTable("Admins");
            modelBuilder.Entity<Doctor>().ToTable("Doctors");
            modelBuilder.Entity<Appointment>().ToTable("Appointments");
            modelBuilder.Entity<Service>().ToTable("Services");
            modelBuilder.Entity<Guest>().ToTable("Guests");
            modelBuilder.Entity<OTP>().ToTable("OTPs");
        }
    }
}

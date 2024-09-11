using BookingApi.Context;
using BookingApi.Migrations;
using BookingApi.Models;
using BookingApi.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace BookingApi.Repositories
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly AppDbContext _dbContext;
        private readonly ISmsService _smsService;

        public AppointmentRepository(AppDbContext dbContext, ISmsService smsService)
        {
            _dbContext = dbContext;
            _smsService = smsService;
        }

        public async Task<int> CreateAppointment(Appointment appointment)
        {
            DateTime selectedDateTime = DateTime.ParseExact(appointment.SelectedTime, "HH:mm", CultureInfo.InvariantCulture);
            TimeSpan selectedTime = selectedDateTime.TimeOfDay;
            selectedTime = selectedTime.Add(TimeSpan.FromMinutes(appointment.Duration ?? 0));
            appointment.EndTime = selectedDateTime.Date.Add(selectedTime).ToString("HH:mm");
            appointment.TotalAmount = appointment.Cost + appointment.AdditionalCost;
            appointment.Reminded = "No";
            appointment.Status = "Ongoing";
            appointment.SelectedDate = appointment.SelectedDate.Date;


            _dbContext.Appointments.Add(appointment);
            await _dbContext.SaveChangesAsync();

            string message = $" \n\nGood day {appointment.Name},\n\n" +
                             $"Your Appointment is scheduled on {appointment.SelectedDate.ToString("dd/MM/yyyy")} at {appointment.SelectedTime} " +
                             $"for {appointment.SelectedService} and will be operated by {appointment.SelectedDoctor} with the amount of {appointment.TotalAmount}.\n\n" +
                             $"Please be on time or come earlier to ensure your scheduled appointment.\n" +
                             $"Failure to do so will cancel the scheduled appointment.\n\n" +
                             $"Thank You.\n\n" +
                             $"Kind Regards,\n" +
                             $"Saint Anthony Dental Clinic";

            appointment.Notification = message;
            await _smsService.SendSmsAsync(appointment.Phone, message);

            await _dbContext.SaveChangesAsync();
            return appointment.Id;
        }

        //public async Task CheckAndSendReminder()
        //{
        //    var appointments = await GetAllAppointments();

        //    foreach (var appointment in appointments)
        //    {
        //        if (appointment.SelectedDate != null)
        //        {
        //            var selectedDate = appointment.SelectedDate.Date;
        //            var selectedTime = TimeSpan.Parse(appointment.SelectedTime);
        //            var selectedDateTime = selectedDate + selectedTime;
        //            if (selectedDateTime < DateTime.UtcNow.AddDays(-2) && selectedDateTime >= DateTime.UtcNow.AddDays(-3))
        //            {
        //                if (appointment.Reminded != "Yes" && appointment.Reminded == null)
        //                {
        //                    appointment.Notification = $" \n\nGood day {appointment.Name},\n\nWe would like to remind you that your appointment is scheduled on {selectedDateTime} for {appointment.SelectedService} and will be operated by {appointment.SelectedDoctor} with the amount of {appointment.TotalAmount}.\n\nPlease be on time or come earlier to ensure your scheduled appointment.\nFailure to do so will cancel the scheduled appointment.\n\nThank you.\n\nKind Regards,\nSaint Anthony Dental Clinic";
        //                    await _smsService.SendSmsAsync(appointment.Phone, appointment.Notification);
        //                    appointment.Reminded = "Yes";
        //                    await UpdateAppointment(appointment);
        //                }
        //            }
        //        }
        //    }
        //}

        public async Task CheckAndFail()
        {
            var appointments = await GetAllAppointments();

            foreach (var appointment in appointments)
            {
                if (appointment.SelectedDate != null)
                {
                    var selectedDate = appointment.SelectedDate.Date;
                    var selectedTime = TimeSpan.Parse(appointment.SelectedTime);
                    var selectedDateTime = selectedDate + selectedTime;
                    if (selectedDateTime < DateTime.UtcNow.AddHours(1))
                    {
                        if (appointment.Status != "Success" && appointment.Status != "Cancel")
                        {
                            appointment.Status = "Fail";
                            await UpdateAppointment(appointment);
                        }
                    }
                }
            }
        }

        public async Task<Appointment> GetAppointmentById(int id)
        {
            return await _dbContext.Appointments.FindAsync(id);
        }

        public async Task UpdateAppointment(Appointment appointment)
        {
            DateTime selectedDateTime = DateTime.ParseExact(appointment.SelectedTime,"HH:mm", CultureInfo.InvariantCulture);
            TimeSpan selectedTime = selectedDateTime.TimeOfDay;
            selectedTime = selectedTime.Add(TimeSpan.FromMinutes(appointment.Duration ?? 0));
            appointment.EndTime = selectedDateTime.Date.Add(selectedTime).ToString("HH:mm");
            appointment.TotalAmount = appointment.Cost + appointment.AdditionalCost;

            var existingAppointment = await _dbContext.Appointments.FindAsync(appointment.Id);

            if (existingAppointment != null)
            {
                existingAppointment.Name = appointment.Name;
                existingAppointment.Phone = appointment.Phone;
                existingAppointment.Age = appointment.Age;
                existingAppointment.Gender = appointment.Gender;
                existingAppointment.SelectedDate = appointment.SelectedDate.Date;
                existingAppointment.SelectedTime = appointment.SelectedTime;
                existingAppointment.SelectedService = appointment.SelectedService;
                existingAppointment.SelectedDoctor = appointment.SelectedDoctor;
                existingAppointment.Duration = appointment.Duration;
                existingAppointment.Cost = appointment.Cost;
                existingAppointment.AdditionalCost = appointment.AdditionalCost;
                existingAppointment.EndTime = appointment.EndTime;
                existingAppointment.TotalAmount= appointment.TotalAmount;
                existingAppointment.Note = appointment.Note;
                existingAppointment.Notification = appointment.Notification;

                if (existingAppointment.Phone != null && existingAppointment.SelectedDate != appointment.SelectedDate)
                {
                    string message = $" \n\nGood day {appointment.Name},\n\n" +
                                     $"Your appointment has been moved to {existingAppointment.SelectedDate.ToString("dd/MM/yyyy")} at the time of {existingAppointment.SelectedTime} for {appointment.SelectedService}.\n\n" +
                                     $"We sincerely apologize for inconvenience and thank you for you understanding.\n\n" +
                                     $"Regards,\n" +
                                     $"Saint Anthony Dental Clinic";

                    existingAppointment.Notification = message;
                    await _smsService.SendSmsAsync(existingAppointment.Phone, message);
                }

                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task<List<Appointment>> GetAllAppointments()
        {
            return await _dbContext.Appointments.ToListAsync();
        }

        public async Task<Appointment> DeleteAppointment(int id)
        {
            var appointment = await _dbContext.Appointments.FindAsync(id);

            if (appointment == null)
            {
                return null;
            }

            _dbContext.Appointments.Remove(appointment);
            await _dbContext.SaveChangesAsync();

            return appointment;
        }

        public async Task<Appointment> CancelAppointment(int id)
        {
            var appointment = await _dbContext.Appointments.FindAsync(id);

            if (appointment == null)
            {
                return null;
            }

            appointment.Status = "Cancelled";
            appointment.Reminded = "No";
            appointment.Notification = $" \n\nGood day {appointment.Name},\n\nThe scheduled appointment has been cancelled, We apologized for inconvenience.\nYou can book an appointment again or go to our branch.\n\nWe sincerely apologize.\n\nRegards,\nSaint Anthony Dental Clinic";

            await _dbContext.SaveChangesAsync();

            await _smsService.SendSmsAsync(appointment.Phone, appointment.Notification);

            return appointment;
        }

        public async Task<IEnumerable<Appointment>> GetSuccessGuestsAsync()
        {
            return await _dbContext.Appointments.Where(g => g.Status == "Success").ToListAsync();
        }

        public async Task<IEnumerable<Appointment>> GetCancelGuestsAsync()
        {
            return await _dbContext.Appointments.Where(g => g.Status == "Cancel").ToListAsync();
        }

        public async Task<IEnumerable<Appointment>> GetFailAppointmentAsync()
        {
            return await _dbContext.Appointments.Where(g => g.Status == "Fail").ToListAsync();
        }

        public async Task<IEnumerable<Appointment>> GetOngoingGuestsAsync()
        {
            return await _dbContext.Appointments.Where(g => g.Status == "Ongoing").ToListAsync();
        }

        public async Task<IEnumerable<Appointment>> GetGuestHistoryAsync()
        {
            return await _dbContext.Appointments.Where(g => g.Status == "Fail" || g.Status == "Cancel" || g.Status == "Success").ToListAsync();
        }

        public async Task<IEnumerable<Appointment>> GetGuestUnsuccessfulAsync()
        {
            return await _dbContext.Appointments.Where(g => g.Status == "Fail" || g.Status == "Cancel").ToListAsync();
        }

        public async Task<(IEnumerable<Appointment> appointments, DateTime currentDate)> GetTodayAppointmentsAsync()
        {
            var currentDate = DateTime.Today;
            var appointments = await _dbContext.Appointments.Where(g => g.SelectedDate == currentDate.AddDays(1) && g.Status == "Ongoing").ToListAsync();
            return (appointments, currentDate);
        }

        public async Task<IEnumerable<Appointment>> GetYearAndMonth(int year, int month)
        {
            var filteredData = await _dbContext.Appointments.Where(d => d.SelectedDate.Year == year && d.SelectedDate.Month == month).ToListAsync();
            return filteredData;
        }

        public async Task<IEnumerable<Appointment>> GetYear(int year)
        {
            var filteredData = await _dbContext.Appointments.Where(d => d.SelectedDate.Year == year).ToListAsync();
            return filteredData;
        }

        public async Task<IEnumerable<Appointment>> GetSuccessYearAndMonth(int year, int month, string status)
        {
            var filteredData = await _dbContext.Appointments.Where(d => d.SelectedDate.Year == year && d.SelectedDate.Month == month && d.Status == status).ToListAsync();
            return filteredData;
        }

        public async Task<Appointment> UpdateGuestStatusSuccessAsync(int id)
        {
            var guest = await _dbContext.Appointments.FindAsync(id);
            if (guest == null)
            {
                throw new ArgumentException("Guest not found");
            }

            string message = $"Good day {guest.Name}, \n\n" +
                $"Thank you for trusting us with your oral health,\n Hoping to see you again.\n\n" +
                $"Best Regards,\nSaint Anthony Dental Clinic";

            await _smsService.SendSmsAsync(guest.Phone, message);

            guest.Status = "Success";
            await _dbContext.SaveChangesAsync();

            return guest;
        }

        public async Task<Appointment> UpdateAppointmentStatusCancelAsync(int id)
        {
            var guest = await _dbContext.Appointments.FindAsync(id);
            if (guest == null)
            {
                throw new ArgumentException("Guest not found");
            }

            guest.Status = "Cancel";

            guest.Notification = $" \n\nGood day {guest.Name},\n\nWe would like to inform you that the scheduled appointment has been cancelled,\n\nWe apologized for inconvenience.\n\nYou can book an appointment again or go to our branch.\n\nWe sincerely apologize.\n\nRegards,\nSaint Anthony Dental Clinic";

            await _dbContext.SaveChangesAsync();

            await _smsService.SendSmsAsync(guest.Phone, guest.Notification);

            return guest;

        }

    }
}

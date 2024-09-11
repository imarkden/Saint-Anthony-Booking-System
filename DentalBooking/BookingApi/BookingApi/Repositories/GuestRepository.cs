using BookingApi.Context;
using BookingApi.Models;
using BookingApi.Models.DTO;
using BookingApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Globalization;
using System.Threading.Tasks;

public class GuestRepository : IGuestRepository
{
    private readonly AppDbContext _context;
    private readonly ISmsService _smsService;   

    public GuestRepository(AppDbContext dbContext, ISmsService smsService)
    {
        _context = dbContext;
        _smsService = smsService;
    }

    public async Task<int> CreateGuestAsync(Guest guest)
    {
        DateTime selectedDateTime = DateTime.ParseExact(guest.SelectedTime, "HH:mm", CultureInfo.InvariantCulture);
        TimeSpan selectedTime = selectedDateTime.TimeOfDay;
        selectedTime = selectedTime.Add(TimeSpan.FromMinutes(30));
        guest.EndTime = selectedDateTime.Date.Add(selectedTime).ToString("HH:mm");
        guest.Status = "Pending";
        guest.SelectedDate = guest.SelectedDate.Date;

        _context.Guests.Add(guest);
        await _context.SaveChangesAsync();

        string message = $"Good day {guest.Name}, \n\n" +
            $"Thank you for booking an appointment,\n your appointment will be verified soon.\n\n" +
            $"We will notify you again after confirming your appointment,\n\nKind Regards,\nSaint Anthony Dental Clinic";

        await _smsService.SendSmsAsync(guest.Phone, message);

        await _context.SaveChangesAsync();
        return guest.Id;
    }

    public async Task<List<Guest>> GetAllGuests()
    {
        return await _context.Guests.ToListAsync();
    }

    //public async Task CheckGuestAndSendReminder()
    //{
    //    var guests = await GetAllGuests();
    //    var currentTime = DateTime.UtcNow;

    //    foreach (var guest in guests)
    //    {
    //        if (guest.SelectedDate != null)
    //        {
    //            var selectedDate = guest.SelectedDate.Date;
    //            var selectedTime = TimeSpan.Parse(guest.SelectedTime);
    //            var selectedDateTime = selectedDate + selectedTime;
    //            var selectedDateTimeUtc = TimeZoneInfo.ConvertTimeToUtc(selectedDateTime, TimeZoneInfo.Local);

    //            if (selectedDateTime < DateTime.UtcNow.AddDays(-2) && selectedDateTime >= DateTime.UtcNow.AddDays(-3))
    //            {
    //                if (guest.Reminded != "Yes" && guest.Reminded == null)
    //                {
    //                    guest.Notification = $" \n\nGood day {guest.Name},\n\nThis is a reminder.\nYour appointment is scheduled on {selectedDateTime}.\n\nPlease be on time or come earlier to ensure your scheduled appointment.\nFailure to do so will cancel the scheduled appointment.\n\nThank you.\n\nKind Regards,\nSaint Anthony Dental Clinic";
    //                    await _smsService.SendSmsAsync(guest.Phone, guest.Notification);
    //                    guest.Reminded = "Yes";
    //                    await UpdateGuest(guest);
    //                }
    //            }
    //            else if (selectedDateTime < DateTime.UtcNow.AddHours(1))
    //            {
    //                if (guest.Status != "Success" && guest.Status != "Cancel")
    //                {
    //                    guest.Status = "Fail";
    //                    await UpdateGuest(guest);
    //                }
    //            }
    //        }
    //    }
    //}

    public async Task CheckGuestAndFail()
    {
        var guests = await GetAllGuests();
        var currentTime = DateTime.UtcNow;

        foreach (var guest in guests)
        {
            if (guest.SelectedDate != null)
            {
                var selectedDate = guest.SelectedDate.Date;
                var selectedTime = TimeSpan.Parse(guest.SelectedTime);
                var selectedDateTime = selectedDate + selectedTime;
                var selectedDateTimeUtc = TimeZoneInfo.ConvertTimeToUtc(selectedDateTime, TimeZoneInfo.Local);

                if (selectedDateTime < DateTime.UtcNow.AddHours(1))
                {
                    if (guest.Status != "Success" && guest.Status != "Cancel")
                    {
                        guest.Status = "Fail";
                        await UpdateGuest(guest);
                    }
                }
            }
        }
    }

    public async Task UpdateGuest(Guest guest)
    {
        DateTime selectedDateTime = DateTime.ParseExact(guest.SelectedTime, "HH:mm", CultureInfo.InvariantCulture);
        TimeSpan selectedTime = selectedDateTime.TimeOfDay;
        selectedTime = selectedTime.Add(TimeSpan.FromMinutes(30));
        guest.EndTime = selectedDateTime.Date.Add(selectedTime).ToString("HH:mm");

        var existingAppointment = await _context.Guests.FindAsync(guest.Id);

        if (existingAppointment != null)
        {
            existingAppointment.Name = guest.Name;
            existingAppointment.Phone = guest.Phone;
            existingAppointment.Age = guest.Age;
            existingAppointment.Service = guest.Service;
            existingAppointment.SelectedDate = guest.SelectedDate.Date;
            existingAppointment.SelectedTime = guest.SelectedTime;
            existingAppointment.EndTime = guest.EndTime;
            existingAppointment.Gender= guest.Gender;
            existingAppointment.Notification = guest.Notification;

            if (existingAppointment.Phone != null && existingAppointment.SelectedDate != guest.SelectedDate)
            {
                string message = $" \n\nGood day {guest.Name},\n\n" +
                                 $"Your appointment has been moved to {existingAppointment.SelectedDate.ToString("dd/MM/yyyy")} at the time of {existingAppointment.SelectedTime}.\n\n" +
                                 $"We sincerely apologize for inconvenience and thank you for you understanding.\n\n" +
                                 $"Regards,\n" +
                                 $"Saint Anthony Dental Clinic";

                existingAppointment.Notification = message;
                await _smsService.SendSmsAsync(existingAppointment.Phone, message);
            }

            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<Guest>> GetPendingGuestsAsync()
    {
        return await _context.Guests.Where(g => g.Status == "Pending").ToListAsync();
    }

    public async Task<IEnumerable<Guest>> GetSuccessGuestsAsync()
    {
        return await _context.Guests.Where(g => g.Status == "Success").ToListAsync();
    }

    public async Task<IEnumerable<Guest>> GetOngoingGuestsAsync()
    {
        return await _context.Guests.Where(g => g.Status == "Ongoing").ToListAsync();
    }

    public async Task<IEnumerable<Guest>> GetCancelGuestsAsync()
    {
        return await _context.Guests.Where(g => g.Status == "Cancel").ToListAsync();
    }

    public async Task<IEnumerable<Guest>> GetFailGuestsAsync()
    {
        return await _context.Guests.Where(g => g.Status == "Fail").ToListAsync();
    }

    public async Task<IEnumerable<Guest>> GetGuestHistoryAsync()
    {
        return await _context.Guests.Where(g => g.Status == "Fail" || g.Status == "Cancel" || g.Status == "Success").ToListAsync();
    }

    public async Task<IEnumerable<Guest>> GetAvailableSlotsAsync()
    {
        return await _context.Guests.Where(g => g.Status == "Ongoing" && g.Status == "Pending").ToListAsync();
    }

    public async Task<(IEnumerable<Guest> guests, DateTime currentDate)> GetTodayGuestsAsync()
    {
        var currentDate = DateTime.Today;
        var guests = await _context.Guests.Where(g => g.SelectedDate == currentDate.AddDays(1) && g.Status == "Ongoing").ToListAsync();
        return (guests, currentDate);
    }

    public async Task<Guest> UpdateGuestStatusSuccessAsync(int id)
    {
        var guest = await _context.Guests.FindAsync(id);
        if (guest == null)
        {
            throw new ArgumentException("Guest not found");
        }

        string message = $"Good day {guest.Name}, \n\n" +
            $"Thank you for trusting us with your oral health,\n Hoping to see you again.\n\n" +
            $"Best Regards,\nSaint Anthony Dental Clinic";

        await _smsService.SendSmsAsync(guest.Phone, message);

        guest.Status = "Success";
        await _context.SaveChangesAsync();

        return guest;
    }

    public async Task<Guest> UpdateGuestStatusConfirmAsync(int id)
    {
        var guest = await _context.Guests.FindAsync(id);
        if (guest == null)
        {
            throw new ArgumentException("Guest not found");
        }

        string message = $"Good day {guest.Name}, \n\n" +
            $"Your booked appointment has been confirmed,\nYou may proceed on {guest.SelectedDate.ToString("dd/MM/yyyy")} at {guest.SelectedTime}.\n\n" +
            $"Please be on time or come earlier to ensure your appointment.\nFailure to do so will be given the appointment to the walk-ins.\n\nKind Regards,\nSaint Anthony Dental Clinic";

        await _smsService.SendSmsAsync(guest.Phone, message);

        guest.Status = "Ongoing";
        await _context.SaveChangesAsync();

        return guest;
    }

    public async Task<Guest> UpdateGuestStatusCancelAsync(int id)
    {
        var guest = await _context.Guests.FindAsync(id);
        if (guest == null)
        {
            throw new ArgumentException("Guest not found");
        }

        guest.Status = "Cancel";

        guest.Notification = $" \n\nGood day {guest.Name},\n\nWe would like to inform you that the scheduled appointment has been cancelled,\n\nWe apologized for inconvenience.\n\nYou can book an appointment again or go to our branch.\n\nWe sincerely apologize.\n\nRegards,\nSaint Anthony Dental Clinic";

        await _context.SaveChangesAsync();

        await _smsService.SendSmsAsync(guest.Phone, guest.Notification);

        return guest;

    }

    public async Task<Guest> GetGuestByPhoneAsync(string phone)
    {
        return await _context.Guests.FirstOrDefaultAsync(guest => guest.Phone == phone);
    }

    public async Task<Guest> GetGuestById(int id)
    {
        return await _context.Guests.FindAsync(id);
    }

    public async Task DeleteGuestAsync(int id)
    {
        var guest = await GetGuestById(id);
        _context.Guests.Remove(guest);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Guest>> GetYearAndMonth(int year, int month)
    {
        var filteredData = await _context.Guests.Where(d => d.SelectedDate.Year == year && d.SelectedDate.Month == month).ToListAsync();
        return filteredData;
    }

    public async Task<IEnumerable<Guest>> GetYear(int year)
    {
        var filteredData = await _context.Guests.Where(d => d.SelectedDate.Year == year).ToListAsync();
        return filteredData;
    }
}
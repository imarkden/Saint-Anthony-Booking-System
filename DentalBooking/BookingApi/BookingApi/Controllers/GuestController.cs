using BookingApi.Migrations;
using BookingApi.Models;
using BookingApi.Models.DTO;
using BookingApi.Repositories;
using BookingApi.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/guests")]
public class GuestController : ControllerBase
{
    private readonly IGuestRepository _guestRepository;

    public GuestController(IGuestRepository guestRepository)
    {
        _guestRepository = guestRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllGuests()
    {
        var guests = await _guestRepository.GetAllGuests();
        return Ok(guests);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetGuestById(int id)
    {
        var guests = await _guestRepository.GetGuestById(id);

        if (guests == null)
        {
            return NotFound();
        }

        return Ok(guests);
    }

    [HttpPost]
    public async Task<IActionResult> CreateGuest(Guest guest)
    {
        if (guest == null)
        {
            return BadRequest();
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var guestId = await _guestRepository.CreateGuestAsync(guest);
            return CreatedAtAction(nameof(GetGuestById), new { id = guestId }, guest);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPut("{Id}")]
    public async Task<IActionResult> UpdateGuest(int id, Guest guest)
    {
        if (guest == null || id != guest.Id)
        {
            return BadRequest();
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existingAppointment = await _guestRepository.GetGuestById(id);

        if (existingAppointment == null)
        {
            return NotFound();
        }

        try
        {
            await _guestRepository.UpdateGuest(guest);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpGet("success")]
    public async Task<IActionResult> GetSuccesasGuestsAsync()
    {
        try
        {
            var guests = await _guestRepository.GetSuccessGuestsAsync();

            return Ok(guests);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving ongoing's guests from the database: {ex.Message}");
        }
    }

    [HttpGet("ongoing")]
    public async Task<IActionResult> GetOngoingGuestsAsync()
    {
        try
        {
            var guests = await _guestRepository.GetOngoingGuestsAsync();

            return Ok(guests);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving ongoing's guests from the database: {ex.Message}");
        }
    }

    [HttpGet("cancel")]
    public async Task<IActionResult> GetCancelGuestsAsync()
    {
        try
        {
            var guests = await _guestRepository.GetCancelGuestsAsync();

            return Ok(guests);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving ongoing's guests from the database: {ex.Message}");
        }
    }

    [HttpGet("fail")]
    public async Task<IActionResult> GetFailGuestsAsync()
    {
        try
        {
            var guests = await _guestRepository.GetFailGuestsAsync();

            return Ok(guests);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving ongoing's guests from the database: {ex.Message}");
        }
    }

    [HttpGet("pending")]
    public async Task<IActionResult> GetPendingGuestsAsync()
    {
        try
        {
            var guests = await _guestRepository.GetPendingGuestsAsync();

            return Ok(guests);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving ongoing's guests from the database: {ex.Message}");
        }
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetGuestHistoryAsync()
    {
        try
        {
            var guests = await _guestRepository.GetGuestHistoryAsync();

            return Ok(guests);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving ongoing's guests from the database: {ex.Message}");
        }
    }

    [HttpGet("slots")]
    public async Task<IActionResult> GetSlotsAsync()
    {
        try
        {
            var guests = await _guestRepository.GetAvailableSlotsAsync();

            return Ok(guests);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving ongoing's guests from the database: {ex.Message}");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteGuest(int id)
    {
        await _guestRepository.DeleteGuestAsync(id);
        return NoContent();
    }
    [HttpPut("{id}/status-success")]
    public async Task<IActionResult> UpdateGuestStatusSuccess(int id)
    {
        try
        {
            var guest = await _guestRepository.UpdateGuestStatusSuccessAsync(id);
            return Ok(guest);
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }

    [HttpPut("{id}/status-confirm")]
    public async Task<IActionResult> UpdateGuestStatusConfirm(int id)
    {
        try
        {
            var guest = await _guestRepository.UpdateGuestStatusConfirmAsync(id);
            return Ok(guest);
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }

    [HttpPut("{id}/status-cancel")]
    public async Task<IActionResult> UpdateGuestStatusCancel(int id)
    {
        try
        {
            var guest = await _guestRepository.UpdateGuestStatusCancelAsync(id);
            return Ok(guest);
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }

    [HttpGet("today")]
    public async Task<IActionResult> GetTodayGuestsAsync()
    {
        try
        {
            var (guests, currentDate) = await _guestRepository.GetTodayGuestsAsync();

            return Ok(guests);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving today's guests from the database: {ex.Message}");
        }
    }

    //[HttpPost("check-date/remind")]
    //public async Task<IActionResult> CheckReminder()
    //{
    //    try
    //    {
    //        await _guestRepository.CheckGuestAndSendReminder();
    //        return Ok();
    //    }
    //    catch (Exception ex)
    //    {
    //        // Log the error
    //        return StatusCode(500, "An error occurred while checking reminders.");
    //    }
    //}

    [HttpPost("check-date/fail")]
    public async Task<IActionResult> CheckReminderFail()
    {
        try
        {
            await _guestRepository.CheckGuestAndFail();
            return Ok();
        }
        catch (Exception ex)
        {
            // Log the error
            return StatusCode(500, "An error occurred while checking reminders.");
        }
    }

    [HttpGet("year/{year}/month/{month}")]
    public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointmentsByYearAndMonth(int year, int month)
    {
        var appointments = await _guestRepository.GetYearAndMonth(year, month);
        return Ok(appointments);
    }

    [HttpGet("year/{year}")]
    public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointmentsByYear(int year)
    {
        var appointments = await _guestRepository.GetYear(year);
        return Ok(appointments);
    }
}

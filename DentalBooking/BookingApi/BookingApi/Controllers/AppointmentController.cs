using AutoMapper;
using BookingApi.Models;
using BookingApi.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingApi.Controllers
{
    [ApiController]
    [Route("api/appointment")]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentRepository _appointmentRepository;

        public AppointmentsController(IAppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAppointments()
        {
            var appointments = await _appointmentRepository.GetAllAppointments();
            return Ok(appointments);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAppointmentById(int id)
        {
            var appointment = await _appointmentRepository.GetAppointmentById(id);

            if (appointment == null)
            {
                return NotFound();
            }

            return Ok(appointment);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAppointment(Appointment appointment)
        {
            if (appointment == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var appointmentId = await _appointmentRepository.CreateAppointment(appointment);
                return CreatedAtAction(nameof(GetAppointmentById), new { id = appointmentId }, appointment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, Appointment appointment)
        {
            if (appointment == null || id != appointment.Id)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingAppointment = await _appointmentRepository.GetAppointmentById(id);

            if (existingAppointment == null)
            {
                return NotFound();
            }

            try
            {
                await _appointmentRepository.UpdateAppointment(appointment);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _appointmentRepository.GetAppointmentById(id);

            if (appointment == null)
            {
                return NotFound();
            }

            try
            {
                await _appointmentRepository.DeleteAppointment(id);
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
                var appointments = await _appointmentRepository.GetSuccessGuestsAsync();

                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving today's guests from the database: {ex.Message}");
            }
        }

        [HttpGet("cancel")]
        public async Task<IActionResult> GetCancelGuestsAsync()
        {
            try
            {
                var appointments = await _appointmentRepository.GetCancelGuestsAsync();

                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving today's guests from the database: {ex.Message}");
            }
        }

        [HttpGet("fail")]
        public async Task<IActionResult> GetFailGuestsAsync()
        {
            try
            {
                var appointments = await _appointmentRepository.GetFailAppointmentAsync();

                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving today's guests from the database: {ex.Message}");
            }
        }

        [HttpGet("ongoing")]
        public async Task<IActionResult> GetOngoingGuestsAsync()
        {
            try
            {
                var appointments = await _appointmentRepository.GetOngoingGuestsAsync();

                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving today's guests from the database: {ex.Message}");
            }
        }

        [HttpGet("today")]
        public async Task<IActionResult> GetTodayGuestsAsync()
        {
            try
            {
                var (appointments, currentDate) = await _appointmentRepository.GetTodayAppointmentsAsync();

                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving today's guests from the database: {ex.Message}");
            }
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetAppointmentHistoryAsync()
        {
            try
            {
                var appointments = await _appointmentRepository.GetGuestHistoryAsync();

                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving today's guests from the database: {ex.Message}");
            }
        }

        [HttpGet("unsuccessful")]
        public async Task<IActionResult> GetAppointmentUnsuccessfulAsync()
        {
            try
            {
                var appointments = await _appointmentRepository.GetGuestUnsuccessfulAsync();

                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving today's guests from the database: {ex.Message}");
            }
        }

        [HttpGet("year/{year}/month/{month}")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointmentsByYearAndMonth(int year, int month)
        {
            var appointments = await _appointmentRepository.GetYearAndMonth(year, month);
            return Ok(appointments);
        }

        [HttpGet("year/{year}")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointmentsByYear(int year)
        {
            var appointments = await _appointmentRepository.GetYear(year);
            return Ok(appointments);
        }

        [HttpGet("status/{status}/year/{year}/month/{month}")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetByYearAndMonth(int year, int month, string status)
        {
            var appointments = await _appointmentRepository.GetSuccessYearAndMonth(year, month, status);
            return Ok(appointments);
        }

        [HttpPut("{id}/status-success")]
        public async Task<IActionResult> UpdateGuestStatusSuccess(int id)
        {
            try
            {
                var guest = await _appointmentRepository.UpdateGuestStatusSuccessAsync(id);
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
                var guest = await _appointmentRepository.UpdateAppointmentStatusCancelAsync(id);
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

        //[HttpPost("check-date/remind")]
        //public async Task<IActionResult> CheckReminder()
        //{
        //    try
        //    {
        //        await _appointmentRepository.CheckAndSendReminder();
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
                await _appointmentRepository.CheckAndFail();
                return Ok();
            }
            catch (Exception ex)
            {
                // Log the error
                return StatusCode(500, $"An error occurred while checking reminders, { ex.Message}");
            }
        }
    }
}
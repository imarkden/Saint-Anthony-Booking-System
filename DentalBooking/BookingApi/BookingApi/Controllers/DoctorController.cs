using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using BookingApi.Context;
using BookingApi.Models;
using BookingApi.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookingApi.Controllers
{
    [Route("api/doctor")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly IDoctorRepository _doctorRepository;

        public DoctorController(IDoctorRepository doctorRepository)
        {
            _doctorRepository = doctorRepository;
        }

        // GET: api/doctor
        [HttpGet]
        public async Task<IEnumerable<Doctor>> GetDoctors()
        {
            return await _doctorRepository.GetDoctorsAsync();
        }

        // GET: api/doctor/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Doctor>> GetDoctor(int id)
        {
            var doctor = await _doctorRepository.GetDoctorByIdAsync(id);

            if (doctor == null)
            {
                return NotFound();
            }

            return doctor;
        }

        // POST: api/doctor
        [HttpPost]
        public async Task<ActionResult<Doctor>> PostDoctor(Doctor doctor)
        {
            await _doctorRepository.AddDoctorAsync(doctor);

            return CreatedAtAction(nameof(GetDoctor), new { id = doctor.Id }, doctor);
        }

        // PUT: api/doctor/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDoctor(int id, Doctor doctor)
        {
            if (id != doctor.Id)
            {
                return BadRequest();
            }

            await _doctorRepository.UpdateDoctorAsync(doctor);

            return NoContent();
        }

        // DELETE: api/doctor/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            await _doctorRepository.DeleteDoctorAsync(id);

            return NoContent();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            // Authenticate the user
            var loggedInDoctor = _doctorRepository.Authenticate(model.Username, model.Password);

            if (loggedInDoctor == null)
            {
                return BadRequest("Invalid username or password");
            }

            // Get the doctor's data by username
            var doctorData = await _doctorRepository.GetDoctorByUsernameAsync(loggedInDoctor.Username);

            // Return the doctor's data
            return Ok(doctorData);
        }


        [HttpGet("username/{username}")]
        public async Task<IActionResult> GetDoctorByUsername(string username)
        {
            var doctor = await _doctorRepository.GetDoctorByUsernameAsync(username);

            if (doctor == null)
            {
                return NotFound("Doctor not found");
            }

            return Ok(doctor);
        }
    }
}
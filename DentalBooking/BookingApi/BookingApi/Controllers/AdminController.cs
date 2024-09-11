using BookingApi.Context;
using BookingApi.Helpers;
using BookingApi.Models;
using BookingApi.Models.DTO;
using BookingApi.Repositories.Interfaces;
using BookingApi.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace BookingApi.Controllers
{
    [Route("api/admin")]
    [ApiController]
    public class AdminController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ISmsService _smsService;
        private readonly IAdminRepository _adminRepository;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IGuestRepository _guestRepository;
        public AdminController(AppDbContext context, IConfiguration configuration, ISmsService smsservice, IAdminRepository adminRepository, IAppointmentRepository appointmentRepository, IGuestRepository guestRepository)
        {
            _context = context;
            _configuration = configuration;
            _smsService = smsservice;
            _adminRepository = adminRepository;
            _appointmentRepository = appointmentRepository;
            _guestRepository = guestRepository;
        }

        [HttpPost("auth")]
        public async Task<IActionResult> Authenticate([FromBody] Admin adminObj)
        {
            if (adminObj == null)
            {
                return BadRequest();
            }

            var admin = await _context.Admins
                .FirstOrDefaultAsync(x => x.Username == adminObj.Username);

            if (admin == null)
            {
                return NotFound(new { Message = "Admin not found."});
            }

            if(!PasswordHasher.VerifyPassword(adminObj.Password,admin.Password))
            {
                return BadRequest(new { Message = "Login failed." });
            }

            admin.Token = CreateJWT(admin);
            var newAccessToken = admin.Token;
            var newRefreshToken = CreateRefreshToken();
            admin.RefreshToken = newRefreshToken;
            admin.RefreshTokenExpiryTime = DateTime.Now.AddDays(1);

            await _context.SaveChangesAsync();

            //await _appointmentRepository.CheckAndSendReminder();
            await _appointmentRepository.CheckAndFail();
            //await _guestRepository.CheckGuestAndSendReminder();
            await _guestRepository.CheckGuestAndFail();

            return Ok(new TokenApiDto()
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAdmin([FromBody] Admin adminObj)
        {
            if (adminObj == null)
            {
                return BadRequest();
            }

            if(await CheckUsernameExistAsync(adminObj.Username))
            {
                return BadRequest(new { Message = "Username already exist." });
            }

            var pass = CheckPasswordStrength(adminObj.Password);
            if (!string.IsNullOrEmpty(pass))
            {
                return BadRequest(new { Message = pass.ToString() });
            }

            adminObj.Password = PasswordHasher.HashPassword(adminObj.Password);
            adminObj.Role = "Admin";
            adminObj.Token = "";
            await _context.Admins.AddAsync(adminObj);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Admin registered."
            });
        }

        private Task<bool> CheckUsernameExistAsync(string username)
            => _context.Admins.AnyAsync(x => x.Username == username);

        private string CheckPasswordStrength(string password)
        {
            StringBuilder sb = new StringBuilder();
            if (password.Length < 8)
                sb.Append("Mimimum password length should be 8" + Environment.NewLine);
            if (!(Regex.IsMatch(password, "[a-z]") && Regex.IsMatch(password, "[A-Z]") && Regex.IsMatch(password, "[0-9]")))
                sb.Append("Password should be alphanumeric" + Environment.NewLine);
            return sb.ToString();
        }

        private string CreateJWT(Admin admin)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("veryverysecret.....");
            var identity = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Role, $"{admin.Role}"),
                new Claim(ClaimTypes.Name, $"{admin.Name}")
            });

            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = credentials,
            };

            var token = jwtTokenHandler.CreateToken(tokenDescriptor);

            return jwtTokenHandler.WriteToken(token);
        }

        private string CreateRefreshToken()
        {
            var tokenBytes = RandomNumberGenerator.GetBytes(64);
            var refreshToken = Convert.ToBase64String(tokenBytes);

            var tokenInUser = _context.Admins
                .Any(x => x.RefreshToken == refreshToken);

            if(tokenInUser)
            {
                return CreateRefreshToken();
            }

            return refreshToken;
        }

        private ClaimsPrincipal GetPrincipleFromExpiredToken(string token)
        {
            var key = Encoding.ASCII.GetBytes("veryverysecret.....");
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateLifetime = false,
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken;

            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken != null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new SecurityTokenException("This is invalid token");
            }
            return principal;
        }


        [HttpGet]
        public async Task<ActionResult<Admin>> GetAllUsers()
        {
            return Ok(await _context.Admins.ToListAsync());
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh(TokenApiDto tokenApiDto)
        {
            if (tokenApiDto == null)
            {
                return BadRequest("Invalid client request");
            }
            string accessToken = tokenApiDto.AccessToken;
            string refreshToken = tokenApiDto.RefreshToken;

            var principal = GetPrincipleFromExpiredToken(accessToken);
            var username = principal.Identity.Name;
            var admin = await _context.Admins.FirstOrDefaultAsync(x => x.Username == username);
            if (admin == null || admin.RefreshToken != refreshToken || admin.RefreshTokenExpiryTime <= DateTime.Now)
            {
                return BadRequest("Invalid Request");
            }

            var newAccessToken = CreateJWT(admin);
            var newRefreshToken = CreateRefreshToken();
            admin.RefreshToken = newRefreshToken;
            await _context.SaveChangesAsync();

            return Ok(new TokenApiDto()
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
            });
        }

        [HttpGet("username/{username}")]
        public async Task<IActionResult> GetAdminByUsernameAsync(string username)
        {
            var admin = await _adminRepository.GetAdminByUsernameAsync(username);

            if (admin == null)
            {
                return NotFound("Admin not found");
            }

            return Ok(admin);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateAdmin(int id, Admin admin)
        {
            if (id != admin.Id)
            {
                return BadRequest("Invalid admin ID");
            }

            var existingAdmin = await _adminRepository.GetAdminByIdAsync(id);

            if (existingAdmin == null)
            {
                return NotFound("Admin not found");
            }

            return NoContent();
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(string username)
        {
            var admin = await _adminRepository.GetAdminByUsernameAsync(username);

            if (admin == null)
            {
                return NotFound("Admin not found");
            }

            // Generate a new OTP
            var otp = _smsService.GenerateOTP();

            // Save the OTP and its generated time to the admin's record in the database
            admin.OTP = otp;
            admin.OTPGeneratedTime = DateTime.UtcNow;
            await _adminRepository.UpdateAdminAsync(admin);

            // Send the OTP to the admin's phone number
            try
            {
                await _smsService.SendOTPCodeBySMS(admin.Phone);
                return Ok("OTP sent successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error sending OTP: {ex.Message}");
            }
        }

        [HttpPost("reset-password/verify-otp")]
        public async Task<IActionResult> VerifyOTPAndResetPassword(string username, string otp, string newPassword)
        {
            var admin = await _adminRepository.GetAdminByUsernameAsync(username);

            if (admin == null)
            {
                return NotFound("Admin not found");
            }

            // Check if the OTP matches
            if (admin.OTP != otp)
            {
                return BadRequest("Invalid OTP");
            }

            // Check if the OTP has expired (e.g., after 5 minutes)
            var otpExpirationTime = admin.OTPGeneratedTime.AddMinutes(5);
            if (DateTime.UtcNow > otpExpirationTime)
            {
                return BadRequest("OTP has expired");
            }

            // Update the admin's record in the database
            await _adminRepository.UpdateAdminAsync(admin);

            return Ok("Password reset successful");
        }
    }
}

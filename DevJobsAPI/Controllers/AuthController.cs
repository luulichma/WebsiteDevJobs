using DevJobsAPI.Models;
using DevJobsAPI.DTOs;
using DevJobsAPI.Models;
using DevJobsAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DevJobsAPI.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly JwtService _jwt;

        public AuthController(AppDbContext db, JwtService jwt)
        {
            _db = db;
            _jwt = jwt;
        }

        /// <summary>Đăng nhập</summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            var user = await _db.Users
                .FirstOrDefaultAsync(u => u.Email == req.Email && u.Status == "active");

            if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
                return Unauthorized(new { message = "Email hoặc mật khẩu không chính xác" });

            int? companyId = null;
            if (user.Role == "recruiter")
            {
                companyId = await _db.Companies
                    .Where(c => c.CreatedBy == user.UserId)
                    .Select(c => c.CompanyId)
                    .FirstOrDefaultAsync();
                
                if (companyId == 0) companyId = null;
            }

            var token = _jwt.GenerateToken(user, companyId);
            return Ok(new AuthResponse
            {
                Token = token,
                User = MapToDto(user, companyId)
            });
        }

        /// <summary>Đăng ký tài khoản mới</summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            if (await _db.Users.AnyAsync(u => u.Email == req.Email))
                return BadRequest(new { message = "Email đã được sử dụng" });

            if (req.Role != "candidate" && req.Role != "recruiter")
                return BadRequest(new { message = "Vai trò không hợp lệ" });

            var user = new User
            {
                Email = req.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
                FullName = req.FullName,
                Phone = req.Phone,
                Role = req.Role,
                Status = "active"
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            var token = _jwt.GenerateToken(user, null);
            return Ok(new AuthResponse
            {
                Token = token,
                User = MapToDto(user, null)
            });
        }

        private static UserDto MapToDto(User u, int? companyId = null) => new UserDto
        {
            UserId = u.UserId,
            Email = u.Email,
            FullName = u.FullName,
            Phone = u.Phone,
            Role = u.Role ?? "candidate",
            Status = u.Status ?? "active",
            CvUrl = u.CvUrl,
            CompanyId = companyId,
            CreatedAt = u.CreatedAt,
            Skills = string.IsNullOrWhiteSpace(u.Skills) ? new() : u.Skills.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(s => s.Trim()).ToList()
        };
    }
}

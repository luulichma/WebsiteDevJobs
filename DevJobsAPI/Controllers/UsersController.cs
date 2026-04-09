using DevJobsAPI.Models;
using DevJobsAPI.DTOs;
using DevJobsAPI.Models;
using DevJobsAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace DevJobsAPI.Controllers
{
    [ApiController]
    [Route("api/users")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly JwtService _jwt;

        public UsersController(AppDbContext db, JwtService jwt)
        {
            _db = db;
            _jwt = jwt;
        }

        private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        private string CurrentRole => User.FindFirstValue(ClaimTypes.Role)!;

        /// <summary>Lấy thông tin user hiện tại</summary>
        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var user = await _db.Users
                .FirstOrDefaultAsync(u => u.UserId == CurrentUserId);
            if (user == null) return NotFound();
            
            int? companyId = null;
            if (user.Role == "recruiter") 
            {
                companyId = await _db.Companies.Where(c => c.CreatedBy == user.UserId).Select(c => (int?)c.CompanyId).FirstOrDefaultAsync();
            }

            return Ok(MapToDto(user, companyId));
        }

        /// <summary>Cập nhật hồ sơ cá nhân (candidate)</summary>
        [HttpPut("me")]
        [Authorize(Roles = "candidate")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            var user = await _db.Users
                .FirstOrDefaultAsync(u => u.UserId == CurrentUserId);
            if (user == null) return NotFound();

            user.FullName = dto.FullName;
            user.Phone = dto.Phone;
            user.CvUrl = dto.CvUrl;

            // Update skills
            user.Skills = string.Join(", ", dto.Skills);

            await _db.SaveChangesAsync();
            return Ok(new { message = "Cập nhật hồ sơ thành công" });
        }

        /// <summary>Lấy danh sách tất cả users (admin only)</summary>
        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAllUsers([FromQuery] string? role, [FromQuery] string? search)
        {
            var query = _db.Users
                .Where(u => u.Role != "admin")
                .AsQueryable();

            if (!string.IsNullOrEmpty(role) && role != "all")
                query = query.Where(u => u.Role == role);

            // Tìm kiếm tiếng Việt không phân biệt dấu
            if (!string.IsNullOrEmpty(search))
                query = query.Where(u => 
                    EF.Functions.Collate(u.FullName, "Vietnamese_CI_AI").Contains(search) || 
                    u.Email.Contains(search));

            var users = await query.OrderByDescending(u => u.CreatedAt).ToListAsync();
            return Ok(users.Select(u => MapToDto(u, null)));
        }

        /// <summary>Khóa / Mở tài khoản user (admin only)</summary>
        [HttpPut("{id}/suspend")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> ToggleSuspend(int id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound();
            if (user.Role == "admin") return BadRequest(new { message = "Không thể khóa tài khoản admin" });

            user.Status = user.Status == "active" ? "suspended" : "active";
            await _db.SaveChangesAsync();
            return Ok(new { message = $"Tài khoản đã được {(user.Status == "active" ? "mở khóa" : "khóa")}", status = user.Status });
        }

        /// <summary>Xóa tài khoản user (admin only)</summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound();
            if (user.Role == "admin") return BadRequest(new { message = "Không thể xóa tài khoản admin" });

            _db.Users.Remove(user);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Xóa tài khoản thành công" });
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

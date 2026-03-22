using DevJobsAPI.Models;
using DevJobsAPI.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DevJobsAPI.Controllers
{
    [ApiController]
    [Route("api/skills")]
    public class SkillsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public SkillsController(AppDbContext db) => _db = db;

        /// <summary>Lấy tất cả danh sách skills (public)</summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var skills = await _db.Skills
                .OrderBy(s => s.Category)
                .ThenBy(s => s.SkillName)
                .Select(s => new SkillDto
                {
                    SkillId = s.SkillId,
                    SkillName = s.SkillName,
                    Category = s.Category
                })
                .ToListAsync();

            return Ok(skills);
        }
    }
}

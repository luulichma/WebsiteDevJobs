namespace DevJobsAPI.DTOs
{
    public class JobDto
    {
        public int JobId { get; set; }
        public int CompanyId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string? CompanyLogo { get; set; }
        public int RecruiterId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? Requirements { get; set; }
        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }
        public string Location { get; set; } = string.Empty;
        public string JobType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateOnly? ExpiryDate { get; set; }
        public DateTime? CreatedAt { get; set; }
        public List<string> Skills { get; set; } = new();
        public int ApplicationCount { get; set; }
    }

    public class CreateJobDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? Requirements { get; set; }
        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }
        public string Location { get; set; } = string.Empty;
        public string JobType { get; set; } = "full-time";
        public DateOnly? ExpiryDate { get; set; }
        public List<int> SkillIds { get; set; } = new();
    }

    public class UpdateJobDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? Requirements { get; set; }
        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }
        public string Location { get; set; } = string.Empty;
        public string JobType { get; set; } = "full-time";
        public DateOnly? ExpiryDate { get; set; }
        public List<int> SkillIds { get; set; } = new();
    }

    public class JobQueryParams
    {
        public string? Keyword { get; set; }
        public string? Location { get; set; }
        public string? JobType { get; set; }
        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }
        public string? Skill { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class PagedResult<T>
    {
        public List<T> Items { get; set; } = new();
        public int Total { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)Total / PageSize);
    }
}

namespace DevJobsAPI.DTOs
{
    public class ApplicationDto
    {
        public int ApplicationId { get; set; }
        public int JobId { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public int CandidateId { get; set; }
        public string CandidateName { get; set; } = string.Empty;
        public string CandidateEmail { get; set; } = string.Empty;
        public string? CvUrl { get; set; }
        public string? CoverLetter { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? AppliedAt { get; set; }
    }

    public class CreateApplicationDto
    {
        public int JobId { get; set; }
        public string? CvUrl { get; set; }
        public string? CoverLetter { get; set; }
    }

    public class UpdateApplicationStatusDto
    {
        public string Status { get; set; } = string.Empty;
    }

    public class CompanyDto
    {
        public int CompanyId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Website { get; set; }
        public string? LogoUrl { get; set; }
        public string? Address { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? CreatedAt { get; set; }
        public int JobCount { get; set; }
    }

    public class UpdateCompanyDto
    {
        public string CompanyName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Website { get; set; }
        public string? LogoUrl { get; set; }
        public string? Address { get; set; }
    }

    public class SkillDto
    {
        public int SkillId { get; set; }
        public string SkillName { get; set; } = string.Empty;
        public string? Category { get; set; }
    }
}

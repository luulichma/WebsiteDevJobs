using System;
using System.Collections.Generic;

namespace DevJobsAPI.Models;

public partial class Job
{
    public int JobId { get; set; }

    public int CompanyId { get; set; }

    public int RecruiterId { get; set; }

    public string Title { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string? Requirements { get; set; }

    public decimal? SalaryMin { get; set; }

    public decimal? SalaryMax { get; set; }

    public string? Location { get; set; }

    public string? JobType { get; set; }

    public string? Status { get; set; }

    public DateOnly? ExpiryDate { get; set; }

    public int? ApprovedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Application> Applications { get; set; } = new List<Application>();

    public virtual User? ApprovedByNavigation { get; set; }

    public virtual Company Company { get; set; } = null!;

    public virtual User Recruiter { get; set; } = null!;

    public virtual ICollection<Skill> Skills { get; set; } = new List<Skill>();
}

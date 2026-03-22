using System;
using System.Collections.Generic;

namespace DevJobsAPI.Models;

public partial class User
{
    public int UserId { get; set; }

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string FullName { get; set; } = null!;

    public string? Phone { get; set; }

    public string? Role { get; set; }

    public string? Status { get; set; }

    public string? CvUrl { get; set; }

    public string? Skills { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Application> ApplicationCandidates { get; set; } = new List<Application>();

    public virtual ICollection<Application> ApplicationReviewedByNavigations { get; set; } = new List<Application>();

    public virtual ICollection<Company> Companies { get; set; } = new List<Company>();

    public virtual ICollection<Job> JobApprovedByNavigations { get; set; } = new List<Job>();

    public virtual ICollection<Job> JobRecruiters { get; set; } = new List<Job>();
}

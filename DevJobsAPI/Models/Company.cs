using System;
using System.Collections.Generic;

namespace DevJobsAPI.Models;

public partial class Company
{
    public int CompanyId { get; set; }

    public string CompanyName { get; set; } = null!;

    public string? Description { get; set; }

    public string? Website { get; set; }

    public string? LogoUrl { get; set; }

    public string? Address { get; set; }

    public string? Status { get; set; }

    public int CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual User CreatedByNavigation { get; set; } = null!;

    public virtual ICollection<Job> Jobs { get; set; } = new List<Job>();
}

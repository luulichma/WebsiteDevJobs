using System;
using System.Collections.Generic;

namespace DevJobsAPI.Models;

public partial class Application
{
    public int ApplicationId { get; set; }

    public int JobId { get; set; }

    public int CandidateId { get; set; }

    public string CvUrl { get; set; } = null!;

    public string? CoverLetter { get; set; }

    public string? Status { get; set; }

    public DateTime? AppliedAt { get; set; }

    public int? ReviewedBy { get; set; }

    public virtual User Candidate { get; set; } = null!;

    public virtual Job Job { get; set; } = null!;

    public virtual User? ReviewedByNavigation { get; set; }
}

using System;
using System.Collections.Generic;

namespace DevJobsAPI.Models;

public partial class Skill
{
    public int SkillId { get; set; }

    public string SkillName { get; set; } = null!;

    public string? Category { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Job> Jobs { get; set; } = new List<Job>();
}

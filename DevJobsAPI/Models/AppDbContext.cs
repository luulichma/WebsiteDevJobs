using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace DevJobsAPI.Models;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Application> Applications { get; set; }

    public virtual DbSet<Company> Companies { get; set; }

    public virtual DbSet<Job> Jobs { get; set; }

    public virtual DbSet<Skill> Skills { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=MSI\\SITE1;Database=DevJobs;Trusted_Connection=True;TrustServerCertificate=True;Integrated Security=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Application>(entity =>
        {
            entity.HasKey(e => e.ApplicationId).HasName("PK__APPLICAT__3BCBDCF22C8D81BE");

            entity.ToTable("APPLICATIONS");

            entity.HasIndex(e => new { e.JobId, e.CandidateId }, "UQ_JOB_CANDIDATE").IsUnique();

            entity.Property(e => e.ApplicationId).HasColumnName("application_id");
            entity.Property(e => e.AppliedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("applied_at");
            entity.Property(e => e.CandidateId).HasColumnName("candidate_id");
            entity.Property(e => e.CoverLetter).HasColumnName("cover_letter");
            entity.Property(e => e.CvUrl)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("cv_url");
            entity.Property(e => e.JobId).HasColumnName("job_id");
            entity.Property(e => e.ReviewedBy).HasColumnName("reviewed_by");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("pending")
                .HasColumnName("status");

            entity.HasOne(d => d.Candidate).WithMany(p => p.ApplicationCandidates)
                .HasForeignKey(d => d.CandidateId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_APP_CANDIDATE");

            entity.HasOne(d => d.Job).WithMany(p => p.Applications)
                .HasForeignKey(d => d.JobId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_APP_JOB");

            entity.HasOne(d => d.ReviewedByNavigation).WithMany(p => p.ApplicationReviewedByNavigations)
                .HasForeignKey(d => d.ReviewedBy)
                .HasConstraintName("FK_APP_REVIEWER");
        });

        modelBuilder.Entity<Company>(entity =>
        {
            entity.HasKey(e => e.CompanyId).HasName("PK__COMPANIE__3E267235026427AE");

            entity.ToTable("COMPANIES");

            entity.Property(e => e.CompanyId).HasColumnName("company_id");
            entity.Property(e => e.Address)
                .HasMaxLength(500)
                .HasColumnName("address");
            entity.Property(e => e.CompanyName)
                .HasMaxLength(255)
                .HasColumnName("company_name");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.LogoUrl)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("logo_url");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("pending")
                .HasColumnName("status");
            entity.Property(e => e.Website)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("website");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.Companies)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_COMPANY_USER");
        });

        modelBuilder.Entity<Job>(entity =>
        {
            entity.HasKey(e => e.JobId).HasName("PK__JOBS__6E32B6A5215366C4");

            entity.ToTable("JOBS");

            entity.Property(e => e.JobId).HasColumnName("job_id");
            entity.Property(e => e.ApprovedBy).HasColumnName("approved_by");
            entity.Property(e => e.CompanyId).HasColumnName("company_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.ExpiryDate).HasColumnName("expiry_date");
            entity.Property(e => e.JobType)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("job_type");
            entity.Property(e => e.Location)
                .HasMaxLength(255)
                .HasColumnName("location");
            entity.Property(e => e.RecruiterId).HasColumnName("recruiter_id");
            entity.Property(e => e.Requirements).HasColumnName("requirements");
            entity.Property(e => e.SalaryMax)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("salary_max");
            entity.Property(e => e.SalaryMin)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("salary_min");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("pending")
                .HasColumnName("status");
            entity.Property(e => e.Title)
                .HasMaxLength(255)
                .HasColumnName("title");

            entity.HasOne(d => d.ApprovedByNavigation).WithMany(p => p.JobApprovedByNavigations)
                .HasForeignKey(d => d.ApprovedBy)
                .HasConstraintName("FK_JOB_ADMIN");

            entity.HasOne(d => d.Company).WithMany(p => p.Jobs)
                .HasForeignKey(d => d.CompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_JOB_COMPANY");

            entity.HasOne(d => d.Recruiter).WithMany(p => p.JobRecruiters)
                .HasForeignKey(d => d.RecruiterId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_JOB_RECRUITER");

            entity.HasMany(d => d.Skills).WithMany(p => p.Jobs)
                .UsingEntity<Dictionary<string, object>>(
                    "JobSkill",
                    r => r.HasOne<Skill>().WithMany()
                        .HasForeignKey("SkillId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_JS_SKILL"),
                    l => l.HasOne<Job>().WithMany()
                        .HasForeignKey("JobId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_JS_JOB"),
                    j =>
                    {
                        j.HasKey("JobId", "SkillId");
                        j.ToTable("JOB_SKILLS");
                        j.IndexerProperty<int>("JobId").HasColumnName("job_id");
                        j.IndexerProperty<int>("SkillId").HasColumnName("skill_id");
                    });
        });

        modelBuilder.Entity<Skill>(entity =>
        {
            entity.HasKey(e => e.SkillId).HasName("PK__SKILLS__FBBA8379F15E8569");

            entity.ToTable("SKILLS");

            entity.HasIndex(e => e.SkillName, "UQ__SKILLS__73C038ADA34A0970").IsUnique();

            entity.Property(e => e.SkillId).HasColumnName("skill_id");
            entity.Property(e => e.Category)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("category");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.SkillName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("skill_name");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__USERS__B9BE370FF79BD7F0");

            entity.ToTable("USERS");

            entity.HasIndex(e => e.Email, "UQ__USERS__AB6E61640039853A").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.CvUrl)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("cv_url");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.FullName)
                .HasMaxLength(255)
                .HasColumnName("full_name");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("password_hash");
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("phone");
            entity.Property(e => e.Role)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("role");
            entity.Property(e => e.Skills).HasColumnName("skills");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("active")
                .HasColumnName("status");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

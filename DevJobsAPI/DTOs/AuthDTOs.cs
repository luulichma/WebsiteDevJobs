namespace DevJobsAPI.DTOs
{
    // ---- Auth ----
    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Role { get; set; } = "candidate"; // candidate | recruiter
    }

    public class GoogleLoginRequest
    {
        public string Credential { get; set; } = string.Empty; // Google ID token
    }

    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public UserDto User { get; set; } = null!;
    }

    // ---- User ----
    public class UserDto
    {
        public int UserId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string Role { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? CvUrl { get; set; }
        public int? CompanyId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public List<string> Skills { get; set; } = new();
    }

    public class UpdateProfileDto
    {
        public string FullName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? CvUrl { get; set; }
        public List<string> Skills { get; set; } = new();
    }
}

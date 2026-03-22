# DevJobs API — Hướng dẫn cài đặt và chạy

## Yêu cầu
- **.NET 8 SDK** — [Tải tại đây](https://dotnet.microsoft.com/download/dotnet/8.0)
- **MySQL Server** (5.7+ hoặc 8.0+)

---

## Bước 1: Cấu hình MySQL

Mở file `appsettings.json` và sửa connection string:
```json
"DefaultConnection": "Server=localhost;Port=3306;Database=devjobs_db;User=root;Password=YOUR_MYSQL_PASSWORD;"
```
Thay `YOUR_MYSQL_PASSWORD` bằng mật khẩu MySQL của bạn.

---

## Bước 2: Restore packages

```bash
dotnet restore
```

---

## Bước 3: Tạo migration và database

```bash
# Tạo migration đầu tiên
dotnet ef migrations add InitialCreate

# Áp dụng migration (tự tạo database + seed data)
dotnet ef database update
```

> **Lưu ý**: Nếu `dotnet ef` không nhận ra, cài tool:
> ```bash
> dotnet tool install --global dotnet-ef
> ```

---

## Bước 4: Chạy API

```bash
dotnet run
```

API sẽ chạy tại: `http://localhost:5050` (hoặc port trong `launchSettings.json`)

Swagger UI: `http://localhost:5050/swagger`

---

## Tài khoản test sẵn có (sau seed data)

| Role | Email | Password |
|------|-------|----------|
| Candidate | candidate@devjobs.vn | 123456 |
| Recruiter | recruiter@devjobs.vn | 123456 |
| Admin | admin@devjobs.vn | 123456 |

---

## Cấu trúc project

```
DevJobsAPI/
├── Controllers/     — API endpoints
├── Data/           — AppDbContext (EF Core)
├── DTOs/           — Data Transfer Objects
├── Models/         — Entity models
├── Services/       — JwtService
├── appsettings.json
└── Program.cs      — Entry point / DI config
```

# Phân tích Kiến trúc và Mô hình Dự án WebsiteDevJobs

Dựa trên các tệp tin lưu trữ (historical artifacts) từ các phiên làm việc trước ([implementation_plan.md](file:///C:/Users/Nguyen%20The%20Chien/.gemini/antigravity/brain/992d6d0b-63b4-415f-85c4-be3a383340f2/implementation_plan.md), [walkthrough.md](file:///C:/Users/Nguyen%20The%20Chien/.gemini/antigravity/brain/992d6d0b-63b4-415f-85c4-be3a383340f2/walkthrough.md)) và cấu hình hiện tại của mã nguồn, dưới đây là phân tích chi tiết về kiến trúc và mô hình đang được sử dụng trong dự án này:

## 1. Mô hình (Model)

Dự án sử dụng các mô hình và mô thức phát triển sau:

- **Mô hình Client-Server (SPA)**: Ứng dụng được tách biệt hoàn toàn giữa Frontend (Client) và Backend (Server), giao tiếp với nhau qua giao thức HTTP/REST.
- **Relational Data Model (Mô hình Dữ liệu Quan hệ)**: Sử dụng **SQL Server** làm hệ quản trị cơ sở dữ liệu chính (đã được xác nhận trong [appsettings.json](file:///f:/BTL_NAM_3_KY_2/WebsiteDevJobs/DevJobsAPI/appsettings.json)).
- **Database-First Approach**: Các lớp Model trong Backend (C#) được tạo tự động từ cấu hình cơ sở dữ liệu hiện có (thông qua lệnh `Scaffold-DbContext`).
- **Stateless Authentication Model**: Sử dụng **JWT (JSON Web Token)** để xác thực, giúp Server không cần lưu trạng thái phiên làm việc (session-less).

## 2. Kiến trúc (Architecture)

### **Kiến trúc Backend (ASP.NET Core 8 Web API)**
Backend tuân theo **Kiến trúc Phân lớp (Layered Architecture / N-Tier)**:
- **Presentation Layer**: Gồm các `Controllers` chịu trách nhiệm tiếp nhận request, điều hướng và phản hồi kết quả API.
- **DTO Layer (Data Transfer Objects)**: Sử dụng các lớp DTO để đóng gói dữ liệu trao đổi giữa Client và Server, giúp tách biệt cấu trúc database nội bộ với dữ liệu trả về cho API.
- **Data Access Layer (EF Core)**: Sử dụng `AppDbContext` và Entity Framework Core để tương tác với SQL Server.
- **Security Layer**: Tích hợp Middleware xác thực JWT Bearer và mã hóa mật khẩu bằng BCrypt.

### **Kiến trúc Frontend (React + Vite)**
Frontend được xây dựng theo **Kiến trúc Dựa trên Thành phần (Component-Based Architecture)**:
- **State Management**: Sử dụng React Context API (cụ thể là `AuthContext.jsx`) để quản lý trạng thái đăng nhập và thông tin người dùng toàn cục.
- **API Service Abstraction**: Có một lớp dịch vụ trung tâm (`apiService.js`) để quản lý các request gọi lên Backend, tự động đính kèm Token khi cần thiết.
- **Vite Build Tool**: Sử dụng Vite để tối ưu hóa quá trình phát triển và đóng gói ứng dụng.

## 3. Tổng kết Công nghệ (Tech Stack)

| Thành phần | Công nghệ sử dụng |
| :--- | :--- |
| **Frontend** | ReactJS, Vite, Vanilla CSS |
| **Backend** | ASP.NET Core 8 (Web API) |
| **Database** | MS SQL Server |
| **ORM** | Entity Framework Core (Database-First) |
| **Security** | JWT, BCrypt, Role-Based Access Control (RBAC) |
| **Dev Tools** | Swagger/OpenAPI (cho viết tài liệu API) |

---
> [!NOTE]
> Dự án này hiện đã hoàn thiện phần tích hợp API, thay thế hoàn toàn dữ liệu giả (Mock Data) bằng dữ liệu thực từ SQL Server.

# UC08: Quản lý các bài đăng tin tuyển dụng

## Mô tả
Nhà tuyển dụng có thể xem danh sách tất cả các tin tuyển dụng mà công ty mình đã đăng, thực hiện các thao tác chỉnh sửa thông tin tin tuyển dụng, gia hạn tin sắp hết hạn, đóng tin khi đã tuyển đủ người, hoặc xóa tin không còn cần thiết.

## Actor
Recruiter (Nhà tuyển dụng) đã đăng nhập vào hệ thống

## Tiền điều kiện
- Recruiter phải đăng nhập vào hệ thống
- Recruiter phải thuộc về một công ty đã được Admin xác minh và kích hoạt

## Hậu điều kiện
- Thông tin tin tuyển dụng được cập nhật trong cơ sở dữ liệu
- Trạng thái của tin tuyển dụng được thay đổi phù hợp với hành động thực hiện
- Hệ thống ghi lại lịch sử thay đổi của tin tuyển dụng
- Email thông báo được gửi đến các bên liên quan nếu cần thiết

---

## Luồng hoạt động chính

1. Recruiter truy cập vào trang "Quản lý tin tuyển dụng" từ menu Dashboard
2. Hệ thống hiển thị danh sách tất cả các tin tuyển dụng của công ty dưới dạng bảng, bao gồm các thông tin:
   - Tiêu đề công việc
   - Ngày đăng tin
   - Ngày hết hạn
   - Số lượng ứng viên đã nộp đơn
   - Trạng thái hiện tại (Đang hoạt động, Chờ duyệt, Đã hết hạn, Đã đóng)
   - Các nút hành động (Sửa, Gia hạn, Đóng, Xóa)
3. Recruiter có thể sử dụng các bộ lọc để tìm kiếm tin tuyển dụng theo trạng thái hoặc thời gian đăng
4. Recruiter chọn một tin tuyển dụng và thực hiện hành động mong muốn

---

## Luồng thay thế

### A1: Chỉnh sửa tin tuyển dụng

Điều kiện: Tin tuyển dụng đang ở trạng thái "Đang hoạt động"

1. Recruiter nhấn nút "Sửa" trên tin tuyển dụng cần chỉnh sửa
2. Hệ thống kiểm tra quyền sở hữu (tin phải thuộc về công ty của Recruiter)
3. Hệ thống hiển thị form chỉnh sửa với dữ liệu hiện tại đã được điền sẵn
4. Recruiter chỉnh sửa các trường thông tin như tiêu đề, mô tả công việc, yêu cầu, mức lương, địa điểm làm việc, loại hợp đồng
5. Recruiter nhấn nút "Lưu thay đổi"
6. Hệ thống kiểm tra tính hợp lệ của dữ liệu đầu vào
7. Hệ thống cập nhật thông tin vào cơ sở dữ liệu
8. Hệ thống ghi lại lịch sử thay đổi
9. Hệ thống hiển thị thông báo "Cập nhật tin tuyển dụng thành công"
10. Hệ thống quay lại trang danh sách tin đã đăng

### A2: Gia hạn tin tuyển dụng

Điều kiện: Tin tuyển dụng đã hết hạn hoặc sắp hết hạn (còn dưới 7 ngày)

1. Recruiter nhấn nút "Gia hạn" trên tin cần gia hạn
2. Hệ thống kiểm tra tài khoản công ty còn credits hoặc gói dịch vụ còn hạn
3. Hệ thống hiển thị hộp thoại xác nhận với thông tin ngày hết hạn mới (gia hạn thêm 30 ngày)
4. Recruiter nhấn "Xác nhận"
5. Hệ thống cập nhật ngày hết hạn mới và đổi trạng thái về "Đang hoạt động" nếu tin đã hết hạn
6. Hệ thống trừ credits hoặc ghi nhận việc sử dụng gói dịch vụ
7. Hệ thống gửi thông báo cho Recruiter
8. Hệ thống hiển thị "Gia hạn tin thành công"

### A3: Đóng tin tuyển dụng

Điều kiện: Tin đang ở trạng thái "Đang hoạt động"

1. Recruiter nhấn nút "Đóng tin" khi đã tuyển đủ người
2. Hệ thống hiển thị hộp thoại xác nhận "Bạn muốn đóng tin tuyển dụng này? Tin sẽ không còn hiển thị với ứng viên"
3. Recruiter nhấn "Xác nhận"
4. Hệ thống cập nhật trạng thái tin tuyển dụng thành "Đã đóng"
5. Hệ thống ghi lại thời gian đóng tin
6. Hệ thống có thể gửi email thông báo đến các ứng viên đã nộp đơn (tuỳ chọn)
7. Hệ thống hiển thị "Đã đóng tin tuyển dụng thành công"

### A4: Xóa tin tuyển dụng

Điều kiện: Tin chưa có ứng viên nào nộp đơn

1. Recruiter nhấn nút "Xóa" trên tin cần xóa
2. Hệ thống kiểm tra xem tin có ứng viên đã nộp đơn hay chưa
3. Hệ thống hiển thị cảnh báo "Hành động này không thể hoàn tác. Bạn chắc chắn muốn xóa?"
4. Recruiter nhấn "Xác nhận xóa"
5. Hệ thống đánh dấu tin là đã xóa (soft delete) hoặc xóa vĩnh viễn khỏi cơ sở dữ liệu
6. Hệ thống hiển thị "Đã xóa tin tuyển dụng"

### A5: Lọc và tìm kiếm tin

1. Recruiter sử dụng các bộ lọc có sẵn trên trang:
   - Lọc theo trạng thái: Tất cả, Đang hoạt động, Chờ duyệt, Đã hết hạn, Đã đóng
   - Lọc theo thời gian: 7 ngày gần đây, 30 ngày gần đây, 3 tháng gần đây, Tất cả
   - Tìm kiếm theo tiêu đề công việc
2. Hệ thống truy vấn và hiển thị kết quả phù hợp
3. Hệ thống hiển thị số lượng kết quả tìm được

---

## Luồng ngoại lệ

### E1: Không có quyền chỉnh sửa

Điều kiện: Recruiter cố gắng chỉnh sửa hoặc xóa tin của công ty khác

1. Hệ thống phát hiện tin không thuộc về công ty của Recruiter
2. Hệ thống từ chối yêu cầu và hiển thị thông báo lỗi "Bạn không có quyền thực hiện hành động này"
3. Hệ thống quay lại trang danh sách

### E2: Không thể xóa tin có ứng viên

Điều kiện: Tin đã có ít nhất một ứng viên nộp đơn

1. Hệ thống kiểm tra và phát hiện có ứng viên đã nộp đơn
2. Hệ thống hiển thị thông báo "Không thể xóa tin này vì đã có [N] ứng viên nộp đơn. Bạn có thể Đóng tin thay vì Xóa"
3. Hệ thống đề xuất nút "Đóng tin tuyển dụng"

### E3: Dữ liệu không hợp lệ khi chỉnh sửa

Điều kiện: Recruiter nhập dữ liệu không đúng định dạng hoặc thiếu thông tin bắt buộc

1. Hệ thống kiểm tra và phát hiện lỗi như:
   - Tiêu đề công việc để trống
   - Ngày hết hạn nhỏ hơn ngày hiện tại
   - Mức lương tối thiểu lớn hơn mức lương tối đa
2. Hệ thống hiển thị thông báo lỗi màu đỏ bên dưới trường nhập liệu có lỗi
3. Hệ thống không cho phép submit form cho đến khi dữ liệu hợp lệ

### E4: Không đủ credits để gia hạn

Điều kiện: Tài khoản công ty không còn đủ credits hoặc gói dịch vụ đã hết hạn

1. Hệ thống kiểm tra và phát hiện không đủ credits
2. Hệ thống hiển thị thông báo "Tài khoản của bạn không đủ credits để gia hạn tin. Vui lòng nâng cấp gói dịch vụ hoặc mua thêm credits"
3. Hệ thống đề xuất nút "Nâng cấp ngay" chuyển đến trang thanh toán

---

## Ghi chú bổ sung

- Hệ thống sử dụng cơ chế "soft delete" (đánh dấu đã xóa) thay vì xóa vĩnh viễn để có thể khôi phục nếu cần
- Mọi thay đổi đều được ghi lại trong lịch sử để theo dõi và kiểm soát
- Khi gia hạn tin, thời gian mặc định là 30 ngày kể từ ngày hiện tại
- Tin ở trạng thái "Chờ duyệt" không thể chỉnh sửa cho đến khi được Admin phê duyệt

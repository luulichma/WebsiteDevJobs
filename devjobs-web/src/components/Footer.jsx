import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <h3>DevJobs</h3>
                    <p>Nền tảng tuyển dụng IT hàng đầu Việt Nam</p>
                </div>
                <div className="footer-links">
                    <div>
                        <h4>Ứng viên</h4>
                        <a href="/jobs">Tìm việc</a>
                        <a href="/profile">Hồ sơ</a>
                    </div>
                    <div>
                        <h4>Nhà tuyển dụng</h4>
                        <a href="/recruiter/post-job">Đăng tin</a>
                        <a href="/recruiter/jobs">Quản lý tin</a>
                    </div>
                    <div>
                        <h4>Liên hệ</h4>
                        <a href="#">support@devjobs.vn</a>
                        <a href="#">024 1234 5678</a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2026 DevJobs — Nguyễn Thế Chiến (B23DCCN095) — Bài tập lớn Lập trình Web</p>
            </div>
        </footer>
    );
}

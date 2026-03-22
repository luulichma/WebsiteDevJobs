import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import './AuthPages.css';

export default function RegisterPage() {
    const [formData, setFormData] = useState({ full_name: '', email: '', password: '', confirmPassword: '', role: 'candidate' });
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            return;
        }
        try {
            await apiService.post('/auth/register', {
                email: formData.email,
                password: formData.password,
                fullName: formData.full_name,
                role: formData.role
            });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi đăng ký. Vui lòng thử lại.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h1>DevJobs</h1>
                    <p>Nền tảng tuyển dụng IT hàng đầu</p>
                </div>

                <h2>Đăng ký tài khoản</h2>
                <p className="auth-subtitle">Tạo tài khoản để bắt đầu!</p>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">🎉 Đăng ký thành công! Đang chuyển hướng...</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Họ và tên</label>
                        <input type="text" name="full_name" className="form-input" placeholder="Nguyễn Văn A"
                            value={formData.full_name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" className="form-input" placeholder="your.email@example.com"
                            value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input type="password" name="password" className="form-input" placeholder="Tối thiểu 6 ký tự"
                            value={formData.password} onChange={handleChange} required minLength={6} />
                    </div>
                    <div className="form-group">
                        <label>Xác nhận mật khẩu</label>
                        <input type="password" name="confirmPassword" className="form-input" placeholder="Nhập lại mật khẩu"
                            value={formData.confirmPassword} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Bạn là</label>
                        <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
                            <option value="candidate">Ứng viên (Candidate)</option>
                            <option value="recruiter">Nhà tuyển dụng (Recruiter)</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block btn-lg">Đăng ký</button>
                </form>

                <p className="auth-footer">
                    Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        const result = login(email, password);
        if (result.success) {
            const role = result.user.role;
            if (role === 'candidate') navigate('/jobs');
            else if (role === 'recruiter') navigate('/recruiter/jobs');
            else if (role === 'admin') navigate('/admin/approve');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h1>DevJobs</h1>
                    <p>Nền tảng tuyển dụng IT hàng đầu</p>
                </div>

                <h2>Đăng nhập</h2>
                <p className="auth-subtitle">Chào mừng bạn quay trở lại!</p>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" className="form-input" placeholder="your.email@example.com"
                            value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input type="password" className="form-input" placeholder="••••••••"
                            value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block btn-lg">Đăng nhập</button>
                </form>

                <div className="auth-divider"><span>Hoặc đăng nhập bằng</span></div>

                <div className="social-login">
                    <button className="social-btn">🔵 Google</button>
                    <button className="social-btn">🔷 Facebook</button>
                </div>

                <p className="auth-footer">
                    Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                </p>

                <div className="demo-accounts">
                    <p><strong>Tài khoản demo:</strong></p>
                    <p>👤 candidate@devjobs.vn / 123456</p>
                    <p>👔 recruiter@devjobs.vn / 123456</p>
                    <p>⚙️ admin@devjobs.vn / 123456</p>
                </div>
            </div>
        </div>
    );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import apiService from '../services/apiService';
import './AuthPages.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loginWithToken } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (result.success) {
            const role = result.user.role;
            if (role === 'candidate') navigate('/jobs');
            else if (role === 'recruiter') navigate('/recruiter/jobs');
            else if (role === 'admin') navigate('/admin/approve');
        } else {
            setError(result.message);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await apiService.post('/auth/google', { credential: credentialResponse.credential });
            const { token, user } = res.data;
            loginWithToken(token, user);
            if (user.role === 'candidate') navigate('/jobs');
            else if (user.role === 'recruiter') navigate('/recruiter/jobs');
            else navigate('/admin/approve');
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập Google thất bại');
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

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Đăng nhập Google thất bại')}
                        text="signin_with"
                        shape="rectangular"
                        locale="vi"
                    />
                </div>

                <p className="auth-footer">
                    Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                </p>

                <div className="demo-accounts">
                    <p><strong>Đăng nhập nhanh:</strong></p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button type="button" className="demo-btn"
                            onClick={() => { setEmail('candidate@devjobs.vn'); setPassword('123456'); }}>
                            👤 Ứng viên
                        </button>
                        <button type="button" className="demo-btn"
                            onClick={() => { setEmail('recruiter@devjobs.vn'); setPassword('123456'); }}>
                            👔 Nhà tuyển dụng
                        </button>
                        <button type="button" className="demo-btn"
                            onClick={() => { setEmail('admin@devjobs.vn'); setPassword('123456'); }}>
                            ⚙️ Admin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

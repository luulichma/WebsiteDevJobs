import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
    const { user, isAuthenticated, isCandidate, isRecruiter, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <Link to="/" className="logo">DevJobs</Link>

                <div className="nav-links">
                    <Link to="/jobs">Tìm việc</Link>

                    {!isAuthenticated && (
                        <>
                            <Link to="/login" className="nav-link-primary">Đăng nhập</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Đăng ký</Link>
                        </>
                    )}

                    {isCandidate && (
                        <>
                            <Link to="/profile">Hồ sơ</Link>
                            <Link to="/applications">Lịch sử ứng tuyển</Link>
                        </>
                    )}

                    {isRecruiter && (
                        <>
                            <Link to="/recruiter/jobs">Quản lý tin</Link>
                            <Link to="/recruiter/post-job">Đăng tin mới</Link>
                            <Link to="/recruiter/applications">Ứng viên</Link>
                            <Link to="/recruiter/company">Công ty</Link>
                        </>
                    )}

                    {isAdmin && (
                        <>
                            <Link to="/admin/approve">Duyệt tin</Link>
                            <Link to="/admin/users">Quản lý Users</Link>
                        </>
                    )}

                    {isAuthenticated && (
                        <div className="user-menu">
                            <span className="user-name">👤 {user.full_name}</span>
                            <button onClick={handleLogout} className="btn-logout">Đăng xuất</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

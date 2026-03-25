import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiSearch, FiUser, FiLogOut, FiPlusCircle, FiFileText, FiUsers, FiCheckSquare, FiBriefcase, FiHome, FiBarChart2 } from 'react-icons/fi';
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
                    <Link to="/jobs"><FiSearch size={15} /> Tìm việc</Link>

                    {!isAuthenticated && (
                        <>
                            <Link to="/login" className="nav-link-primary">Đăng nhập</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Đăng ký</Link>
                        </>
                    )}

                    {isCandidate && (
                        <>
                            <Link to="/profile"><FiUser size={15} /> Hồ sơ</Link>
                            <Link to="/applications"><FiFileText size={15} /> Lịch sử</Link>
                        </>
                    )}

                    {isRecruiter && (
                        <>
                            <Link to="/recruiter/jobs"><FiBriefcase size={15} /> Quản lý tin</Link>
                            <Link to="/recruiter/post-job"><FiPlusCircle size={15} /> Đăng tin</Link>
                            <Link to="/recruiter/applications"><FiUsers size={15} /> Ứng viên</Link>
                            <Link to="/recruiter/company"><FiHome size={15} /> Công ty</Link>
                        </>
                    )}

                    {isAdmin && (
                        <>
                            <Link to="/admin/dashboard"><FiBarChart2 size={15} /> Thống kê</Link>
                            <Link to="/admin/approve"><FiCheckSquare size={15} /> Duyệt tin</Link>
                            <Link to="/admin/users"><FiUsers size={15} /> Users</Link>
                        </>
                    )}

                    {isAuthenticated && (
                        <div className="user-menu">
                            <span className="user-name"><FiUser size={14} /> {user.full_name}</span>
                            <button onClick={handleLogout} className="btn-logout"><FiLogOut size={14} /> Đăng xuất</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

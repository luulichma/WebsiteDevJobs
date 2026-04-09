import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import { FiUsers, FiBriefcase, FiFileText, FiHome, FiUserCheck, FiLoader, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import './DashboardPages.css';
import './AdminDashboardPage.css';

const StatCard = ({ icon, label, value, color, sub, onClick }) => (
    <div className="stat-card" style={{ borderTop: `4px solid ${color}`, cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
        <div className="stat-icon" style={{ background: `${color}18`, color }}>{icon}</div>
        <div className="stat-info">
            <span className="stat-value">{value ?? '...'}</span>
            <span className="stat-label">{label}</span>
            {sub && <span className="stat-sub">{sub}</span>}
        </div>
    </div>
);

export default function AdminDashboardPage() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // States for Modals
    const [showCompaniesModal, setShowCompaniesModal] = useState(false);
    const [companiesList, setCompaniesList] = useState([]);
    const [loadingCompanies, setLoadingCompanies] = useState(false);

    useEffect(() => {
        apiService.get('/admin/stats')
            .then(res => setStats(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const fetchCompanies = async () => {
        setLoadingCompanies(true);
        setShowCompaniesModal(true);
        try {
            const res = await apiService.get('/admin/companies');
            setCompaniesList(res.data);
        } catch (e) {
            alert('Lỗi tải danh sách công ty');
            setShowCompaniesModal(false);
        } finally {
            setLoadingCompanies(false);
        }
    };

    if (loading) return (
        <div className="dashboard-page">
            <div className="container" style={{ paddingTop: 80, textAlign: 'center', color: '#6b7280' }}>
                <FiLoader size={32} style={{ animation: 'spin 1s linear infinite' }} />
                <p style={{ marginTop: 12 }}>Đang tải thống kê...</p>
            </div>
        </div>
    );

    const s = stats;

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="page-header">
                    <h1>📊 Tổng quan hệ thống</h1>
                    <p>Thống kê toàn bộ hoạt động của nền tảng DevJobs</p>
                </div>

                {/* Row 1 — Main KPIs */}
                <div className="stats-grid-4">
                    <StatCard icon={<FiUsers size={24} />} label="Người dùng" value={s.users.total}
                        color="#6366f1" sub="Xem quản lý" onClick={() => navigate('/admin/users')} />
                    <StatCard icon={<FiBriefcase size={24} />} label="Tin tuyển dụng" value={s.jobs.total}
                        color="#10b981" sub="Duyệt tin" onClick={() => navigate('/admin/approve')} />
                    <StatCard icon={<FiFileText size={24} />} label="Hồ sơ ứng tuyển" value={s.applications.total}
                        color="#f59e0b" sub="Bảo mật" onClick={() => alert("Hồ sơ ứng tuyển chứa CV bảo mật. Chỉ có công ty đăng tuyển mới được quyền xem chi tiết!")} />
                    <StatCard icon={<FiHome size={24} />} label="Công ty" value={s.companies.total}
                        color="#ec4899" sub="Xem chi tiết" onClick={fetchCompanies} />
                </div>

                {/* Row 2 — Jobs & Applications breakdown */}
                <div className="stats-grid-2 mt-3">
                    {/* Jobs breakdown */}
                    <div className="card">
                        <h3 style={{ marginBottom: 16 }}>📋 Trạng thái tin tuyển dụng</h3>
                        <div className="breakdown-list">
                            <div className="breakdown-row">
                                <span><FiCheckCircle color="#10b981" /> Đang tuyển</span>
                                <div className="breakdown-bar-wrap">
                                    <div className="breakdown-bar" style={{ width: `${s.jobs.total ? (s.jobs.active / s.jobs.total) * 100 : 0}%`, background: '#10b981' }} />
                                </div>
                                <strong>{s.jobs.active}</strong>
                            </div>
                            <div className="breakdown-row">
                                <span><FiClock color="#f59e0b" /> Chờ duyệt</span>
                                <div className="breakdown-bar-wrap">
                                    <div className="breakdown-bar" style={{ width: `${s.jobs.total ? (s.jobs.pending / s.jobs.total) * 100 : 0}%`, background: '#f59e0b' }} />
                                </div>
                                <strong>{s.jobs.pending}</strong>
                            </div>
                            <div className="breakdown-row">
                                <span><FiXCircle color="#6b7280" /> Đã đóng</span>
                                <div className="breakdown-bar-wrap">
                                    <div className="breakdown-bar" style={{ width: `${s.jobs.total ? (s.jobs.closed / s.jobs.total) * 100 : 0}%`, background: '#9ca3af' }} />
                                </div>
                                <strong>{s.jobs.closed}</strong>
                            </div>
                        </div>
                        <div className="card-footer-link">
                            <Link to="/admin/approve">Duyệt tin chờ xử lý →</Link>
                        </div>
                    </div>

                    {/* Applications breakdown */}
                    <div className="card">
                        <h3 style={{ marginBottom: 16 }}>📨 Trạng thái hồ sơ ứng tuyển</h3>
                        <div className="breakdown-list">
                            <div className="breakdown-row">
                                <span><FiClock color="#f59e0b" /> Chờ duyệt</span>
                                <div className="breakdown-bar-wrap">
                                    <div className="breakdown-bar" style={{ width: `${s.applications.total ? (s.applications.pending / s.applications.total) * 100 : 0}%`, background: '#f59e0b' }} />
                                </div>
                                <strong>{s.applications.pending}</strong>
                            </div>
                            <div className="breakdown-row">
                                <span><FiUserCheck color="#6366f1" /> Phỏng vấn</span>
                                <div className="breakdown-bar-wrap">
                                    <div className="breakdown-bar" style={{ width: `${s.applications.total ? (s.applications.interview / s.applications.total) * 100 : 0}%`, background: '#6366f1' }} />
                                </div>
                                <strong>{s.applications.interview}</strong>
                            </div>
                            <div className="breakdown-row">
                                <span><FiCheckCircle color="#10b981" /> Đã nhận</span>
                                <div className="breakdown-bar-wrap">
                                    <div className="breakdown-bar" style={{ width: `${s.applications.total ? (s.applications.accepted / s.applications.total) * 100 : 0}%`, background: '#10b981' }} />
                                </div>
                                <strong>{s.applications.accepted}</strong>
                            </div>
                            <div className="breakdown-row">
                                <span><FiXCircle color="#ef4444" /> Từ chối</span>
                                <div className="breakdown-bar-wrap">
                                    <div className="breakdown-bar" style={{ width: `${s.applications.total ? (s.applications.rejected / s.applications.total) * 100 : 0}%`, background: '#ef4444' }} />
                                </div>
                                <strong>{s.applications.rejected}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 3 — Recent activity */}
                <div className="stats-grid-2 mt-3">
                    <div className="card">
                        <h3 style={{ marginBottom: 12 }}>👤 Người dùng mới nhất</h3>
                        <table>
                            <thead><tr><th>Tên</th><th>Role</th><th>Ngày tạo</th></tr></thead>
                            <tbody>
                                {s.recentUsers.map(u => (
                                    <tr key={u.userId}>
                                        <td>
                                            <strong>{u.fullName}</strong>
                                            <div style={{ fontSize: 12, color: '#9ca3af' }}>{u.email}</div>
                                        </td>
                                        <td><span className={`badge ${u.role === 'candidate' ? 'badge-info' : 'badge-warning'}`}>
                                            {u.role === 'candidate' ? 'Ứng viên' : 'NTD'}
                                        </span></td>
                                        <td style={{ fontSize: 13 }}>{new Date(u.createdAt).toLocaleDateString('vi-VN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="card-footer-link">
                            <Link to="/admin/users">Xem tất cả người dùng →</Link>
                        </div>
                    </div>

                    <div className="card">
                        <h3 style={{ marginBottom: 12 }}>📌 Tin đăng mới nhất</h3>
                        <table>
                            <thead><tr><th>Tiêu đề</th><th>Trạng thái</th><th>Ngày đăng</th></tr></thead>
                            <tbody>
                                {s.recentJobs.map(j => (
                                    <tr key={j.jobId}>
                                        <td>
                                            <strong>{j.title}</strong>
                                            <div style={{ fontSize: 12, color: '#9ca3af' }}>{j.companyName}</div>
                                        </td>
                                        <td><span className={`badge ${j.status === 'active' ? 'badge-success' : j.status === 'pending' ? 'badge-warning' : 'badge-secondary'}`}>
                                            {j.status === 'active' ? 'Đang tuyển' : j.status === 'pending' ? 'Chờ duyệt' : 'Đã đóng'}
                                        </span></td>
                                        <td style={{ fontSize: 13 }}>{new Date(j.createdAt).toLocaleDateString('vi-VN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="card-footer-link">
                            <Link to="/admin/approve">Xem tin chờ duyệt →</Link>
                        </div>
                    </div>
                </div>

                {/* Companies Modal */}
                {showCompaniesModal && (
                    <div className="modal-overlay" onClick={() => setShowCompaniesModal(false)}>
                        <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px', maxHeight: '85vh', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <h2>🏢 Danh sách Công ty hoạt động</h2>
                                <button className="btn btn-secondary btn-sm" onClick={() => setShowCompaniesModal(false)}><FiXCircle size={18} /></button>
                            </div>
                            
                            {loadingCompanies ? (
                                <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                                    <FiLoader size={24} style={{ animation: 'spin 1s linear infinite' }} /> Vui lòng chờ...
                                </div>
                            ) : companiesList.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#6b7280' }}>Chưa có công ty nào.</p>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Tên công ty</th>
                                            <th>Địa chỉ</th>
                                            <th>Số Job mở</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {companiesList.map(c => (
                                            <tr key={c.companyId}>
                                                <td><strong>{c.companyName}</strong></td>
                                                <td>{c.address}</td>
                                                <td>{c.jobCount} tin</td>
                                                <td><span className={`badge ${c.status === 'active' ? 'badge-success' : 'badge-secondary'}`}>{c.status === 'active' ? 'Hoạt động' : c.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

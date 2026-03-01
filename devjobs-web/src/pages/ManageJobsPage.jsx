import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getJobsByRecruiter, APPLICATIONS, getStatusLabel, getStatusBadge } from '../data/mockData';
import './DashboardPages.css';

export default function ManageJobsPage() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState(getJobsByRecruiter(user?.user_id));
    const [filter, setFilter] = useState('all');
    const [showConfirm, setShowConfirm] = useState(null);

    const filtered = filter === 'all' ? jobs : jobs.filter(j => j.status === filter);

    const handleClose = (jobId) => {
        setJobs(prev => prev.map(j => j.job_id === jobId ? { ...j, status: 'closed' } : j));
        setShowConfirm(null);
    };

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>Quản lý tin tuyển dụng</h1>
                        <p>Xem và quản lý tất cả tin đăng của công ty</p>
                    </div>
                    <Link to="/recruiter/post-job" className="btn btn-primary">+ Đăng tin mới</Link>
                </div>

                <div className="filter-tabs mb-3">
                    {['all', 'active', 'pending', 'closed', 'expired'].map(f => (
                        <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                            {f === 'all' ? 'Tất cả' : getStatusLabel(f)} ({f === 'all' ? jobs.length : jobs.filter(j => j.status === f).length})
                        </button>
                    ))}
                </div>

                <div className="card">
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr><th>Tiêu đề</th><th>Ứng viên</th><th>Ngày đăng</th><th>Hết hạn</th><th>Trạng thái</th><th>Thao tác</th></tr>
                            </thead>
                            <tbody>
                                {filtered.map(job => {
                                    const appCount = APPLICATIONS.filter(a => a.job_id === job.job_id).length;
                                    return (
                                        <tr key={job.job_id}>
                                            <td><Link to={`/jobs/${job.job_id}`} style={{ color: '#667eea', fontWeight: 500 }}>{job.title}</Link></td>
                                            <td>{appCount} hồ sơ</td>
                                            <td>{job.created_at}</td>
                                            <td>{job.expiry_date}</td>
                                            <td><span className={`badge ${getStatusBadge(job.status)}`}>{getStatusLabel(job.status)}</span></td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                                    {job.status === 'active' && (
                                                        <>
                                                            <button className="btn btn-sm btn-secondary">✏️ Sửa</button>
                                                            <button className="btn btn-sm btn-warning" onClick={() => setShowConfirm({ type: 'close', jobId: job.job_id })}>Đóng tin</button>
                                                        </>
                                                    )}
                                                    {(job.status === 'expired' || job.status === 'closed') && (
                                                        <button className="btn btn-sm btn-success" onClick={() => {
                                                            setJobs(prev => prev.map(j => j.job_id === job.job_id ? { ...j, status: 'active' } : j));
                                                            alert('Đã gia hạn thêm 30 ngày!');
                                                        }}>🔄 Gia hạn</button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {showConfirm && (
                    <div className="modal-overlay" onClick={() => setShowConfirm(null)}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <h3>Xác nhận đóng tin</h3>
                            <p className="text-muted mt-1">Tin sẽ không còn hiển thị với ứng viên. Bạn chắc chắn?</p>
                            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                                <button className="btn btn-danger" onClick={() => handleClose(showConfirm.jobId)}>Xác nhận đóng</button>
                                <button className="btn btn-secondary" onClick={() => setShowConfirm(null)}>Hủy</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

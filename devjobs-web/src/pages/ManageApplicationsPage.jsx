import { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { FiFile, FiCalendar, FiUserCheck, FiUserX, FiX, FiExternalLink, FiMail } from 'react-icons/fi';
import './DashboardPages.css';

const getStatusBadge = (status) => {
    switch (status) {
        case 'pending': return 'badge-warning';
        case 'shortlisted': case 'interview': return 'badge-info';
        case 'accepted': return 'badge-success';
        case 'rejected': return 'badge-danger';
        default: return 'badge-secondary';
    }
};

const getStatusLabel = (status) => {
    switch (status) {
        case 'pending': return 'Chờ duyệt';
        case 'shortlisted': return 'Qua vòng hồ sơ';
        case 'interview': return 'Phỏng vấn';
        case 'accepted': return 'Đã Offer';
        case 'rejected': return 'Từ chối';
        default: return status;
    }
};

export default function ManageApplicationsPage() {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [apps, setApps] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [loadingApps, setLoadingApps] = useState(false);
    const [viewApp, setViewApp] = useState(null); // Modal xem chi tiết ứng viên

    useEffect(() => {
        apiService.get('/jobs/my').then(res => {
            setJobs(res.data);
            if (res.data.length > 0) {
                setSelectedJob(res.data[0].jobId);
            }
        }).catch(err => console.error(err))
          .finally(() => setLoadingJobs(false));
    }, []);

    useEffect(() => {
        if (!selectedJob) return;
        setLoadingApps(true);
        apiService.get(`/applications/job/${selectedJob}`)
            .then(res => setApps(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoadingApps(false));
    }, [selectedJob]);

    const updateStatus = async (appId, newStatus) => {
        try {
            await apiService.put(`/applications/${appId}/status`, { status: newStatus });
            setApps(prev => prev.map(a => a.applicationId === appId ? { ...a, status: newStatus } : a));
            // Cập nhật luôn trong modal nếu đang mở
            if (viewApp && viewApp.applicationId === appId) {
                setViewApp(prev => ({ ...prev, status: newStatus }));
            }
        } catch (e) {
            alert('Lỗi khi cập nhật trạng thái');
        }
    };

    if (loadingJobs) return <div className="container mt-3">Đang tải danh sách công việc...</div>;

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="page-header">
                    <h1>Quản lý hồ sơ ứng viên</h1>
                    <p>Xem và đánh giá hồ sơ ứng tuyển cho các tin đăng</p>
                </div>

                <div className="card mb-3">
                    <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Chọn tin tuyển dụng:</label>
                    <select className="form-select" value={selectedJob || ''} onChange={e => setSelectedJob(parseInt(e.target.value))}>
                        {jobs.map(j => (
                            <option key={j.jobId} value={j.jobId}>{j.title} ({j.applicationCount} ứng viên)</option>
                        ))}
                    </select>
                </div>

                <div className="card">
                    {loadingApps ? (
                        <div style={{ padding: 20 }}>Đang tải danh sách ứng viên...</div>
                    ) : apps.length === 0 ? (
                        <div className="empty-state"><p>Chưa có ứng viên nào nộp hồ sơ cho tin này</p></div>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr><th>Ứng viên</th><th>Email</th><th>Ngày nộp</th><th>Trạng thái</th><th>Thao tác</th></tr>
                                </thead>
                                <tbody>
                                    {apps.map(app => (
                                        <tr key={app.applicationId}>
                                            <td><strong>{app.candidateName}</strong></td>
                                            <td>{app.candidateEmail}</td>
                                            <td><FiCalendar size={13} style={{ marginRight: 4 }} />{new Date(app.appliedAt).toLocaleDateString()}</td>
                                            <td><span className={`badge ${getStatusBadge(app.status)}`}>{getStatusLabel(app.status)}</span></td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                                    <button className="btn btn-sm btn-primary" onClick={() => setViewApp(app)}><FiFile size={13} /> CV</button>
                                                    <button className="btn btn-sm btn-success" onClick={() => updateStatus(app.applicationId, 'interview')}><FiUserCheck size={13} /> Mời PV</button>
                                                    <button className="btn btn-sm btn-danger" onClick={() => updateStatus(app.applicationId, 'rejected')}><FiUserX size={13} /> Từ chối</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Modal Chi tiết Ứng viên */}
                {viewApp && (
                    <div className="modal-overlay" onClick={() => setViewApp(null)}>
                        <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <h2>Chi tiết hồ sơ ứng viên</h2>
                                <button onClick={() => setViewApp(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <FiX size={24} color="#6b7280" />
                                </button>
                            </div>

                            <div style={{ background: '#f9fafb', borderRadius: 12, padding: 20, marginBottom: 20 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 22, fontWeight: 700 }}>
                                        {viewApp.candidateName?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0 }}>{viewApp.candidateName}</h3>
                                        <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 14 }}>
                                            <FiMail size={13} style={{ marginRight: 4 }} />{viewApp.candidateEmail}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 16, fontSize: 14, color: '#6b7280' }}>
                                    <span><FiCalendar size={13} style={{ marginRight: 4 }} />Ngày nộp: {new Date(viewApp.appliedAt).toLocaleDateString()}</span>
                                    <span className={`badge ${getStatusBadge(viewApp.status)}`}>{getStatusLabel(viewApp.status)}</span>
                                </div>
                            </div>

                            {/* CV Section */}
                            <div style={{ marginBottom: 20 }}>
                                <h4 style={{ marginBottom: 8 }}>📄 CV / Hồ sơ</h4>
                                {viewApp.cvUrl ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe' }}>
                                        <FiFile size={20} color="#3b82f6" />
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: 0, fontWeight: 500, fontSize: 14 }}>{viewApp.cvUrl.split('/').pop()}</p>
                                            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6b7280' }}>{viewApp.cvUrl}</p>
                                        </div>
                                        <a href={viewApp.cvUrl} target="_blank" rel="noreferrer"
                                            className="btn btn-sm btn-primary" style={{ textDecoration: 'none' }}>
                                            <FiExternalLink size={13} /> Mở CV
                                        </a>
                                    </div>
                                ) : (
                                    <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>Ứng viên chưa đính kèm CV</p>
                                )}
                            </div>

                            {/* Cover Letter */}
                            {viewApp.coverLetter && (
                                <div style={{ marginBottom: 20 }}>
                                    <h4 style={{ marginBottom: 8 }}>✉️ Thư giới thiệu (Cover Letter)</h4>
                                    <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0', fontStyle: 'italic', lineHeight: 1.7, color: '#374151' }}>
                                        "{viewApp.coverLetter}"
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: 10, borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
                                <button className="btn btn-success" style={{ flex: 1 }}
                                    onClick={() => { updateStatus(viewApp.applicationId, 'interview'); }}>
                                    <FiUserCheck size={15} /> Mời phỏng vấn
                                </button>
                                <button className="btn btn-info" style={{ flex: 1 }}
                                    onClick={() => { updateStatus(viewApp.applicationId, 'accepted'); }}>
                                    ✅ Chấp nhận (Offer)
                                </button>
                                <button className="btn btn-danger"
                                    onClick={() => { updateStatus(viewApp.applicationId, 'rejected'); }}>
                                    <FiUserX size={15} /> Từ chối
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

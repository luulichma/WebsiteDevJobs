import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import { FiUpload, FiX, FiCheckCircle } from 'react-icons/fi';
import './DashboardPages.css';

const getStatusBadge = (status) => {
    switch (status) {
        case 'pending': return 'badge-warning';
        case 'reviewed': return 'badge-info';
        case 'shortlisted': return 'badge-info';
        case 'interview': return 'badge-info';
        case 'accepted': return 'badge-success';
        case 'rejected': return 'badge-danger';
        default: return 'badge-secondary';
    }
};

const getStatusLabel = (status) => {
    switch (status) {
        case 'pending': return 'Chờ duyệt';
        case 'reviewed': return 'Đang xem xét';
        case 'shortlisted': return 'Qua vòng hồ sơ';
        case 'interview': return 'Mời phỏng vấn';
        case 'accepted': return 'Đã trúng tuyển';
        case 'rejected': return 'Đã từ chối';
        default: return status;
    }
};

export default function ApplicationHistoryPage() {
    const { user } = useAuth();
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editApp, setEditApp] = useState(null);
    const [newCvFile, setNewCvFile] = useState(null);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    useEffect(() => {
        apiService.get('/applications/my-applications')
            .then(res => setApps(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleUpdateCV = (e) => {
        e.preventDefault();
        if (!newCvFile) { alert('Vui lòng chọn file CV mới!'); return; }
        // TODO: API cho phép upload CV bổ sung hiện chưa có, giả lập thay đổi UI
        setApps(prev => prev.map(a =>
            a.applicationId === editApp.applicationId
                ? { ...a, cvUrl: `/uploads/${newCvFile.name}` }
                : a
        ));
        setUpdateSuccess(true);
        setTimeout(() => { setEditApp(null); setUpdateSuccess(false); setNewCvFile(null); }, 1800);
    };

    if (loading) return <div className="container mt-3">Đang tải...</div>;

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="page-header">
                    <h1>Lịch sử ứng tuyển</h1>
                    <p>Theo dõi trạng thái các hồ sơ đã nộp</p>
                </div>
                <div className="card">
                    {apps.length === 0 ? (
                        <div className="empty-state">
                            <p>Bạn chưa ứng tuyển công việc nào</p>
                            <Link to="/jobs" className="btn btn-primary mt-2">Tìm việc ngay</Link>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr><th>Vị trí</th><th>Công ty</th><th>Ngày nộp</th><th>CV</th><th>Trạng thái</th><th>Thao tác</th></tr>
                                </thead>
                                <tbody>
                                    {apps.map(app => {
                                        const cvName = app.cvUrl?.split('/').pop() || 'cv.pdf';
                                        return (
                                            <tr key={app.applicationId}>
                                                <td>
                                                    <Link to={`/jobs/${app.jobId}`} style={{ color: '#667eea', fontWeight: 500 }}>
                                                        {app.jobTitle || 'N/A'}
                                                    </Link>
                                                </td>
                                                <td>{app.companyName || 'N/A'}</td>
                                                <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                                                <td style={{ fontSize: 13, color: '#6b7280' }}>📄 {cvName}</td>
                                                <td>
                                                    <span className={`badge ${getStatusBadge(app.status)}`}>
                                                        {getStatusLabel(app.status)}
                                                    </span>
                                                </td>
                                                <td>
                                                    {app.status === 'pending' && (
                                                        <button
                                                            className="btn btn-sm btn-secondary"
                                                            onClick={() => { setEditApp(app); setNewCvFile(null); setUpdateSuccess(false); }}
                                                        >
                                                            <FiUpload size={13} /> Cập nhật CV
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Update CV Modal */}
                {editApp && (
                    <div className="modal-overlay" onClick={() => setEditApp(null)}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            {updateSuccess ? (
                                <div className="text-center" style={{ padding: '32px 0' }}>
                                    <FiCheckCircle size={56} color="#10b981" style={{ marginBottom: 16 }} />
                                    <h2>Cập nhật CV thành công!</h2>
                                    <p className="text-muted mt-1">Hồ sơ của bạn (giả lập) đã được cập nhật.</p>
                                </div>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                        <h2>Cập nhật CV (Demo)</h2>
                                        <button onClick={() => setEditApp(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                            <FiX size={24} color="#6b7280" />
                                        </button>
                                    </div>

                                    <p className="text-muted mb-2">
                                        Vị trí: <strong>{editApp.jobTitle}</strong>
                                    </p>
                                    <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>
                                        CV hiện tại: <strong>{editApp.cvUrl?.split('/').pop() || 'Thư mục mặc định'}</strong>
                                    </p>

                                    <form onSubmit={handleUpdateCV}>
                                        <div className="form-group">
                                            <label><FiUpload size={14} style={{ marginRight: 4 }} /> Chọn CV mới (PDF, DOC, DOCX) *</label>
                                            <input
                                                type="file"
                                                className="form-input"
                                                accept=".pdf,.doc,.docx"
                                                style={{ border: '2px dashed #d1d5db' }}
                                                onChange={e => setNewCvFile(e.target.files[0])}
                                                required
                                            />
                                            <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>Dung lượng tối đa: 5MB</p>
                                        </div>

                                        {newCvFile && (
                                            <div className="alert alert-info" style={{ fontSize: 13 }}>
                                                Đã chọn: <strong>{newCvFile.name}</strong> ({(newCvFile.size / 1024).toFixed(0)} KB)
                                            </div>
                                        )}

                                        <div style={{ display: 'flex', gap: 12 }}>
                                            <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                                                <FiUpload size={15} /> Cập nhật CV
                                            </button>
                                            <button type="button" className="btn btn-secondary" onClick={() => setEditApp(null)}>
                                                Hủy
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

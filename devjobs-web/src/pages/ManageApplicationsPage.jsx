import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getJobsByRecruiter, APPLICATIONS, getUserById, getStatusLabel, getStatusBadge } from '../data/mockData';
import { FiFile, FiCalendar, FiUserCheck, FiUserX } from 'react-icons/fi';
import './DashboardPages.css';

export default function ManageApplicationsPage() {
    const { user } = useAuth();
    const jobs = getJobsByRecruiter(user?.user_id);
    const [selectedJob, setSelectedJob] = useState(jobs[0]?.job_id || null);

    const apps = APPLICATIONS.filter(a => a.job_id === selectedJob);

    const updateStatus = (appId, newStatus) => {
        alert(`Đã cập nhật trạng thái thành "${getStatusLabel(newStatus)}"`);
    };

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
                            <option key={j.job_id} value={j.job_id}>{j.title} ({APPLICATIONS.filter(a => a.job_id === j.job_id).length} ứng viên)</option>
                        ))}
                    </select>
                </div>

                <div className="card">
                    {apps.length === 0 ? (
                        <div className="empty-state"><p>Chưa có ứng viên nào nộp hồ sơ cho tin này</p></div>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr><th>Ứng viên</th><th>Email</th><th>Ngày nộp</th><th>Trạng thái</th><th>Thao tác</th></tr>
                                </thead>
                                <tbody>
                                    {apps.map(app => {
                                        const candidate = getUserById(app.candidate_id);
                                        return (
                                            <tr key={app.application_id}>
                                                <td><strong>{candidate?.full_name}</strong></td>
                                                <td>{candidate?.email}</td>
                                                <td><FiCalendar size={13} style={{ marginRight: 4 }} />{app.applied_at}</td>
                                                <td><span className={`badge ${getStatusBadge(app.status)}`}>{getStatusLabel(app.status)}</span></td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                                        <button className="btn btn-sm btn-primary" onClick={() => alert(`Xem CV: ${app.cv_url}`)}><FiFile size={13} /> CV</button>
                                                        <button className="btn btn-sm btn-success" onClick={() => updateStatus(app.application_id, 'interview')}><FiUserCheck size={13} /> Mời PV</button>
                                                        <button className="btn btn-sm btn-danger" onClick={() => updateStatus(app.application_id, 'rejected')}><FiUserX size={13} /> Từ chối</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {apps.length > 0 && apps[0]?.cover_letter && (
                        <div style={{ marginTop: 24, padding: 16, background: '#f9fafb', borderRadius: 8 }}>
                            <h4>Thư giới thiệu (Cover Letter):</h4>
                            <p className="text-muted mt-1" style={{ fontStyle: 'italic' }}>"{apps[0].cover_letter}"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

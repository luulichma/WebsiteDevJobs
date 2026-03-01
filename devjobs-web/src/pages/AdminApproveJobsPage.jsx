import { useState } from 'react';
import { Link } from 'react-router-dom';
import { JOBS, getCompanyById, getUserById, getStatusLabel, getStatusBadge } from '../data/mockData';
import './DashboardPages.css';

export default function AdminApproveJobsPage() {
    const [jobs, setJobs] = useState(JOBS);
    const [filter, setFilter] = useState('pending');
    const [selectedJob, setSelectedJob] = useState(null);

    const filtered = filter === 'all' ? jobs : jobs.filter(j => j.status === filter);

    const handleApprove = (jobId) => {
        setJobs(prev => prev.map(j => j.job_id === jobId ? { ...j, status: 'active' } : j));
        setSelectedJob(null);
    };

    const handleReject = (jobId) => {
        setJobs(prev => prev.map(j => j.job_id === jobId ? { ...j, status: 'rejected' } : j));
        setSelectedJob(null);
    };

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="page-header">
                    <h1>Duyệt tin tuyển dụng</h1>
                    <p>Kiểm tra và phê duyệt các tin đăng từ nhà tuyển dụng</p>
                </div>

                <div className="filter-tabs mb-3">
                    {['pending', 'active', 'rejected', 'all'].map(f => (
                        <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                            {f === 'all' ? 'Tất cả' : getStatusLabel(f)} ({f === 'all' ? jobs.length : jobs.filter(j => j.status === f).length})
                        </button>
                    ))}
                </div>

                <div className="card">
                    {filtered.length === 0 ? (
                        <div className="empty-state"><p>Không có tin nào</p></div>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr><th>Tiêu đề</th><th>Công ty</th><th>Người đăng</th><th>Ngày đăng</th><th>Trạng thái</th><th>Thao tác</th></tr>
                                </thead>
                                <tbody>
                                    {filtered.map(job => {
                                        const company = getCompanyById(job.company_id);
                                        const recruiter = getUserById(job.recruiter_id);
                                        return (
                                            <tr key={job.job_id}>
                                                <td>
                                                    <button className="link-btn" onClick={() => setSelectedJob(job)}>{job.title}</button>
                                                </td>
                                                <td>{company?.company_name}</td>
                                                <td>{recruiter?.full_name}</td>
                                                <td>{job.created_at}</td>
                                                <td><span className={`badge ${getStatusBadge(job.status)}`}>{getStatusLabel(job.status)}</span></td>
                                                <td>
                                                    {job.status === 'pending' && (
                                                        <div style={{ display: 'flex', gap: 8 }}>
                                                            <button className="btn btn-sm btn-success" onClick={() => handleApprove(job.job_id)}>✅ Duyệt</button>
                                                            <button className="btn btn-sm btn-danger" onClick={() => handleReject(job.job_id)}>❌ Từ chối</button>
                                                        </div>
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

                {/* Job Detail Modal */}
                {selectedJob && (
                    <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
                        <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                            <h2>{selectedJob.title}</h2>
                            <p className="text-muted mb-2">{getCompanyById(selectedJob.company_id)?.company_name} • {selectedJob.location}</p>
                            <div className="mb-2">
                                <strong>Mô tả:</strong>
                                <p style={{ marginTop: 4 }}>{selectedJob.description}</p>
                            </div>
                            <div className="mb-2">
                                <strong>Yêu cầu:</strong>
                                <ul style={{ marginTop: 4 }}>
                                    {selectedJob.requirements?.split('\n').map((r, i) => <li key={i}>• {r}</li>)}
                                </ul>
                            </div>
                            <div className="mb-2">
                                <strong>Kỹ năng:</strong>
                                <div className="tags mt-1">{selectedJob.skills?.map(s => <span className="tag" key={s}>{s}</span>)}</div>
                            </div>
                            <div className="mb-3">
                                <strong>Mức lương:</strong> ${selectedJob.salary_min?.toLocaleString()} - ${selectedJob.salary_max?.toLocaleString()}
                            </div>
                            {selectedJob.status === 'pending' && (
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <button className="btn btn-success btn-lg" style={{ flex: 1 }} onClick={() => handleApprove(selectedJob.job_id)}>✅ Duyệt tin</button>
                                    <button className="btn btn-danger btn-lg" style={{ flex: 1 }} onClick={() => handleReject(selectedJob.job_id)}>❌ Từ chối</button>
                                </div>
                            )}
                            {selectedJob.status !== 'pending' && (
                                <button className="btn btn-secondary btn-block" onClick={() => setSelectedJob(null)}>Đóng</button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

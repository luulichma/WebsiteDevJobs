import { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { FiCheck, FiX, FiEye } from 'react-icons/fi';
import './DashboardPages.css';

const getStatusBadge = (status) => {
    switch (status) {
        case 'pending': return 'badge-warning';
        case 'active': return 'badge-success';
        case 'rejected': return 'badge-danger';
        default: return 'badge-secondary';
    }
};

const getStatusLabel = (status) => {
    switch (status) {
        case 'pending': return 'Chờ duyệt';
        case 'active': return 'Đã duyệt';
        case 'rejected': return 'Từ chối';
        default: return status;
    }
};

export default function AdminApproveJobsPage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        const fetchPendingJobs = async () => {
            try {
                const res = await apiService.get('/jobs/pending');
                setJobs(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPendingJobs();
    }, []);

    const handleApprove = async (jobId) => {
        try {
            await apiService.put(`/jobs/${jobId}/approve`);
            setJobs(prev => prev.filter(j => j.jobId !== jobId));
            setSelectedJob(null);
            alert('Đã duyệt tin thành công');
        } catch (e) {
            alert('Lỗi phê duyệt');
        }
    };

    const handleReject = async (jobId) => {
        try {
            await apiService.put(`/jobs/${jobId}/reject`);
            setJobs(prev => prev.filter(j => j.jobId !== jobId));
            setSelectedJob(null);
            alert('Đã từ chối tin');
        } catch (e) {
            alert('Lỗi từ chối');
        }
    };

    if (loading) return <div className="container mt-3">Đang tải danh sách chờ duyệt...</div>;

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="page-header">
                    <h1>Duyệt tin tuyển dụng</h1>
                    <p>Kiểm tra và phê duyệt các tin đăng đang chờ từ nhà tuyển dụng</p>
                </div>

                <div className="card">
                    {jobs.length === 0 ? (
                        <div className="empty-state"><p>Không có tin nào đang chờ duyệt</p></div>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr><th>Tiêu đề</th><th>Công ty</th><th>Ngày nộp</th><th>Trạng thái</th><th>Thao tác</th></tr>
                                </thead>
                                <tbody>
                                    {jobs.map(job => (
                                        <tr key={job.jobId}>
                                            <td>
                                                <button className="link-btn" onClick={() => setSelectedJob(job)}><FiEye size={13} style={{ marginRight: 4 }} />{job.title}</button>
                                            </td>
                                            <td>{job.companyName}</td>
                                            <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                                            <td><span className={`badge ${getStatusBadge(job.status)}`}>{getStatusLabel(job.status)}</span></td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <button className="btn btn-sm btn-success" onClick={() => handleApprove(job.jobId)}><FiCheck size={14} /> Duyệt</button>
                                                    <button className="btn btn-sm btn-danger" onClick={() => handleReject(job.jobId)}><FiX size={14} /> Từ chối</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Job Detail Modal */}
                {selectedJob && (
                    <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
                        <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                            <h2>{selectedJob.title}</h2>
                            <p className="text-muted mb-2">{selectedJob.companyName} • {selectedJob.location}</p>
                            <div className="mb-2">
                                <strong>Mô tả:</strong>
                                <p style={{ marginTop: 4, whiteSpace: 'pre-wrap' }}>{selectedJob.description}</p>
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
                                <strong>Mức lương (dự kiến):</strong> ${selectedJob.salaryMin?.toLocaleString()} - ${selectedJob.salaryMax?.toLocaleString()}
                            </div>
                            
                            <div style={{ display: 'flex', gap: 12 }}>
                                <button className="btn btn-success btn-lg" style={{ flex: 1 }} onClick={() => handleApprove(selectedJob.jobId)}><FiCheck /> Duyệt tin</button>
                                <button className="btn btn-danger btn-lg" style={{ flex: 1 }} onClick={() => handleReject(selectedJob.jobId)}><FiX /> Từ chối</button>
                            </div>
                            <div className="mt-2 text-center">
                                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedJob(null)}>Huỷ</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

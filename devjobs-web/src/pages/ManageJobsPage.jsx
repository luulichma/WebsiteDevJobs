import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getJobsByRecruiter, APPLICATIONS, getStatusLabel, getStatusBadge } from '../data/mockData';
import { FiPlus, FiEdit, FiXCircle, FiRefreshCw, FiSave, FiX } from 'react-icons/fi';
import './DashboardPages.css';

export default function ManageJobsPage() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState(getJobsByRecruiter(user?.user_id));
    const [filter, setFilter] = useState('all');
    const [showConfirm, setShowConfirm] = useState(null);
    const [editJob, setEditJob] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [editSaved, setEditSaved] = useState(false);

    const filtered = filter === 'all' ? jobs : jobs.filter(j => j.status === filter);

    const handleClose = (jobId) => {
        setJobs(prev => prev.map(j => j.job_id === jobId ? { ...j, status: 'closed' } : j));
        setShowConfirm(null);
    };

    const openEdit = (job) => {
        setEditJob(job);
        setEditForm({
            title: job.title,
            description: job.description,
            requirements: job.requirements,
            benefits: job.benefits || '',
            salary_min: job.salary_min,
            salary_max: job.salary_max,
            location: job.location,
            job_type: job.job_type,
        });
        setEditSaved(false);
    };

    const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

    const handleEditSave = (e) => {
        e.preventDefault();
        setJobs(prev => prev.map(j =>
            j.job_id === editJob.job_id ? { ...j, ...editForm, salary_min: Number(editForm.salary_min), salary_max: Number(editForm.salary_max) } : j
        ));
        setEditSaved(true);
        setTimeout(() => { setEditJob(null); setEditSaved(false); }, 1500);
    };

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>Quản lý tin tuyển dụng</h1>
                        <p>Xem và quản lý tất cả tin đăng của công ty</p>
                    </div>
                    <Link to="/recruiter/post-job" className="btn btn-primary"><FiPlus size={16} /> Đăng tin mới</Link>
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
                                                            <button className="btn btn-sm btn-secondary" onClick={() => openEdit(job)}><FiEdit size={13} /> Sửa</button>
                                                            <button className="btn btn-sm btn-warning" onClick={() => setShowConfirm({ type: 'close', jobId: job.job_id })}><FiXCircle size={13} /> Đóng</button>
                                                        </>
                                                    )}
                                                    {(job.status === 'expired' || job.status === 'closed') && (
                                                        <button className="btn btn-sm btn-success" onClick={() => {
                                                            setJobs(prev => prev.map(j => j.job_id === job.job_id ? { ...j, status: 'active' } : j));
                                                            alert('Đã gia hạn thêm 30 ngày!');
                                                        }}><FiRefreshCw size={13} /> Gia hạn</button>
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

                {/* Close Confirm Modal */}
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

                {/* Edit Job Modal */}
                {editJob && (
                    <div className="modal-overlay" onClick={() => setEditJob(null)}>
                        <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }}>
                            {editSaved ? (
                                <div className="text-center" style={{ padding: '40px 0' }}>
                                    <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                                    <h2>Cập nhật thành công!</h2>
                                    <p className="text-muted mt-1">Tin tuyển dụng đã được cập nhật.</p>
                                </div>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                                        <h2>Sửa tin tuyển dụng</h2>
                                        <button onClick={() => setEditJob(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FiX size={24} color="#6b7280" /></button>
                                    </div>
                                    <form onSubmit={handleEditSave}>
                                        <div className="form-group">
                                            <label>Tiêu đề công việc *</label>
                                            <input type="text" name="title" className="form-input" value={editForm.title} onChange={handleEditChange} required />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Lương tối thiểu ($)</label>
                                                <input type="number" name="salary_min" className="form-input" value={editForm.salary_min} onChange={handleEditChange} />
                                            </div>
                                            <div className="form-group">
                                                <label>Lương tối đa ($)</label>
                                                <input type="number" name="salary_max" className="form-input" value={editForm.salary_max} onChange={handleEditChange} />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Địa điểm</label>
                                                <select name="location" className="form-select" value={editForm.location} onChange={handleEditChange}>
                                                    <option>Hà Nội</option><option>TP. Hồ Chí Minh</option><option>Đà Nẵng</option><option>Remote</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Loại hình</label>
                                                <select name="job_type" className="form-select" value={editForm.job_type} onChange={handleEditChange}>
                                                    <option value="full-time">Toàn thời gian</option><option value="part-time">Bán thời gian</option>
                                                    <option value="remote">Remote</option><option value="contract">Hợp đồng</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Mô tả công việc *</label>
                                            <textarea name="description" className="form-textarea" rows="4" value={editForm.description} onChange={handleEditChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Yêu cầu ứng viên *</label>
                                            <textarea name="requirements" className="form-textarea" rows="4" value={editForm.requirements} onChange={handleEditChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Quyền lợi</label>
                                            <textarea name="benefits" className="form-textarea" rows="3" value={editForm.benefits} onChange={handleEditChange} />
                                        </div>
                                        <div style={{ display: 'flex', gap: 12 }}>
                                            <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 1 }}><FiSave size={16} /> Lưu thay đổi</button>
                                            <button type="button" className="btn btn-secondary" onClick={() => setEditJob(null)}>Hủy</button>
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

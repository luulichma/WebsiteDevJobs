import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import { FiMapPin, FiBriefcase, FiClock, FiHome, FiGlobe, FiUpload, FiCheckCircle } from 'react-icons/fi';
import './JobDetailPage.css';

export default function JobDetailPage() {
    const { id } = useParams();
    const { user, isAuthenticated, isCandidate } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showApply, setShowApply] = useState(false);
    const [applied, setApplied] = useState(false);
    const [alreadyApplied, setAlreadyApplied] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await apiService.get(`/jobs/${id}`);
                setJob(res.data);
                if (isAuthenticated && isCandidate) {
                    const apps = await apiService.get('/applications/my-applications');
                    const hasApplied = apps.data.some(a => a.jobId === parseInt(id));
                    setAlreadyApplied(hasApplied);
                }
            } catch (error) {
                console.error('Job loading error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id, isAuthenticated, isCandidate]);

    if (loading) return <div className="container mt-3">Đang tải...</div>;
    if (!job) return <div className="container mt-3"><div className="card"><h2>Không tìm thấy công việc</h2><Link to="/jobs">← Quay lại tìm kiếm</Link></div></div>;

    const handleApply = async (e) => {
        e.preventDefault();
        try {
            await apiService.post('/applications', {
                jobId: job.jobId,
                cvUrl: user?.cvUrl || '/uploads/cv.pdf',
                coverLetter: coverLetter
            });
            setApplied(true);
            setShowApply(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Lỗi khi ứng tuyển');
        }
    };

    return (
        <div className="job-detail-page">
            <div className="container">
                <div className="detail-grid">
                    <main className="detail-main card">
                        <div className="detail-header">
                            <h1>{job.title}</h1>
                            <div className="detail-meta">
                                <span><FiHome size={16} /> {job.companyName}</span>
                                <span><FiMapPin size={16} /> {job.location}</span>
                                <span><FiBriefcase size={16} /> {job.jobType === 'full-time' ? 'Toàn thời gian' : job.jobType === 'remote' ? 'Remote' : job.jobType}</span>
                                <span><FiClock size={16} /> Đăng ngày {new Date(job.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="detail-salary">${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()} / tháng</div>
                            <div className="tags mb-2">
                                {job.skills?.map(s => <span className="tag" key={s}>{s}</span>)}
                            </div>

                            {applied || alreadyApplied ? (
                                <div className="alert alert-success"><FiCheckCircle style={{ marginRight: 6 }} /> Bạn đã nộp hồ sơ cho vị trí này</div>
                            ) : isCandidate ? (
                                <button className="btn btn-primary btn-block btn-lg" onClick={() => setShowApply(true)}>
                                    <FiUpload style={{ marginRight: 6 }} /> Ứng tuyển ngay
                                </button>
                            ) : !isAuthenticated ? (
                                <Link to="/login" className="btn btn-primary btn-block btn-lg" style={{ display: 'block', textAlign: 'center' }}>
                                    Đăng nhập để ứng tuyển
                                </Link>
                            ) : null}
                        </div>

                        <div className="detail-section">
                            <h2>Mô tả công việc</h2>
                            <p>{job.description}</p>
                        </div>

                        <div className="detail-section">
                            <h2>Yêu cầu công việc</h2>
                            <ul>
                                {job.requirements?.split('\n').map((r, i) => <li key={i}>• {r}</li>)}
                            </ul>
                        </div>
                    </main>

                    <aside className="detail-sidebar">
                        <div className="card">
                            <h3>Về công ty</h3>
                            <div className="sidebar-logo">{job.companyName?.substring(0, 3).toUpperCase()}</div>
                            <h4>{job.companyName}</h4>
                            <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.6', marginTop: '8px' }}>
                                Đăng bởi: Cty {job.companyName}
                            </p>
                        </div>
                    </aside>
                </div>

                {/* Apply Modal */}
                {showApply && (
                    <div className="modal-overlay" onClick={() => setShowApply(false)}>
                        <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '550px' }}>
                            <h2>Nộp hồ sơ ứng tuyển</h2>
                            <p className="text-muted mb-2">Vị trí: {job.title}</p>
                            <form onSubmit={handleApply}>
                                <div className="form-group">
                                    <label><FiUpload size={14} style={{ marginRight: 4 }} /> Upload CV (PDF, DOCX) *</label>
                                    <input type="file" className="form-input" accept=".pdf,.doc,.docx" required
                                        style={{ border: '2px dashed #d1d5db' }} />
                                    <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>Dung lượng tối đa: 5MB</p>
                                </div>
                                <div className="form-group">
                                    <label>Thư xin việc (Cover Letter)</label>
                                    <textarea className="form-textarea" rows="5" value={coverLetter}
                                        onChange={e => setCoverLetter(e.target.value)}
                                        placeholder="Giới thiệu về bản thân và lý do bạn phù hợp với vị trí này..." />
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 1 }}>Nộp đơn ứng tuyển</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowApply(false)}>Hủy</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

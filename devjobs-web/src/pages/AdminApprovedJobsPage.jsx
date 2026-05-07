import { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { FiX, FiEye, FiSearch, FiFilter } from 'react-icons/fi';
import './DashboardPages.css';
import Pagination from '../components/Pagination';

const getStatusBadge = (status) => {
    switch (status) {
        case 'pending': return 'badge-warning';
        case 'active': return 'badge-success';
        case 'rejected': return 'badge-danger';
        case 'closed': return 'badge-secondary';
        default: return 'badge-secondary';
    }
};

const getStatusLabel = (status) => {
    switch (status) {
        case 'pending': return 'Chờ duyệt';
        case 'active': return 'Đã duyệt';
        case 'rejected': return 'Từ chối';
        case 'closed': return 'Đã đóng';
        default: return status;
    }
};

export default function AdminApprovedJobsPage() {
    const [jobs, setJobs] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkAction, setBulkAction] = useState(null); // 'close'
    const itemsPerPage = 10;

    // Filters
    const [searchInput, setSearchInput] = useState('');
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState('');
    const [isPromotedFilter, setIsPromotedFilter] = useState('');

    const locations = ['Hà Nội', 'TP Hồ Chí Minh', 'Đà Nẵng'];

    const fetchApprovedJobs = async () => {
        setLoading(true);
        try {
            const params = {
                status: 'active',
                page: currentPage,
                pageSize: itemsPerPage,
                keyword,
                location,
                jobType
            };
            if (isPromotedFilter !== '') params.isPromoted = isPromotedFilter === 'true';

            const res = await apiService.get('/jobs/admin-list', { params });
            setJobs(res.data.items);
            setTotal(res.data.total);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApprovedJobs();
    }, [currentPage, keyword, location, jobType, isPromotedFilter]);

    const handleSearch = () => {
        setKeyword(searchInput);
        setCurrentPage(1);
    };

    const handleCloseJob = async (jobId) => {
        if (!window.confirm("Bạn có chắc chắn muốn đóng tin này? Nó sẽ không còn hiển thị cho người dùng nữa.")) return;
        try {
            await apiService.put(`/jobs/${jobId}/reject`); // reject endpoint sets status to 'closed'
            setJobs(prev => prev.filter(j => j.jobId !== jobId));
            setSelectedIds(prev => prev.filter(id => id !== jobId));
            setSelectedJob(null);
            alert('Đã đóng tin tuyển dụng thành công');
        } catch (e) {
            alert('Lỗi đóng tin');
        }
    };

    const handleTogglePromote = async (jobId) => {
        try {
            const res = await apiService.put(`/jobs/${jobId}/toggle-promote`);
            const newIsPromoted = res.data.isPromoted;
            setJobs(prev => prev.map(j => j.jobId === jobId ? { ...j, isPromoted: newIsPromoted } : j));
            if (selectedJob && selectedJob.jobId === jobId) {
                setSelectedJob({ ...selectedJob, isPromoted: newIsPromoted });
            }
        } catch (e) {
            alert('Lỗi chuyển đổi trạng thái Promote');
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const currentIds = paginatedJobs.map(j => j.jobId);
            setSelectedIds(prev => [...new Set([...prev, ...currentIds])]);
        } else {
            const currentIds = paginatedJobs.map(j => j.jobId);
            setSelectedIds(prev => prev.filter(id => !currentIds.includes(id)));
        }
    };

    const handleSelectRow = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    if (loading) return <div className="container mt-3">Đang tải danh sách tin đã duyệt...</div>;

    const totalPages = Math.ceil(total / itemsPerPage);
    const paginatedJobs = jobs; // Dữ liệu đã phân trang từ backend

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>Tin đã duyệt</h1>
                        <p>Quản lý các tin đăng đang hoạt động trên hệ thống</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="card" style={{ marginBottom: '20px', padding: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flex: 1, minWidth: '250px' }}>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Tìm tên công việc hoặc công ty..." 
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                        />
                        <button className="btn btn-primary" onClick={handleSearch} style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
                            <FiSearch />
                        </button>
                    </div>
                    <select className="form-control" style={{ width: '150px' }} value={location} onChange={e => { setLocation(e.target.value); setCurrentPage(1); }}>
                        <option value="">📍 Tất cả địa điểm</option>
                        {locations.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <select className="form-control" style={{ width: '150px' }} value={jobType} onChange={e => { setJobType(e.target.value); setCurrentPage(1); }}>
                        <option value="">💼 Loại hình</option>
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="remote">Remote</option>
                        <option value="freelance">Freelance</option>
                    </select>
                    <select className="form-control" style={{ width: '150px' }} value={isPromotedFilter} onChange={e => { setIsPromotedFilter(e.target.value); setCurrentPage(1); }}>
                        <option value="">🔥 Tất cả Promote</option>
                        <option value="true">Đã Promote</option>
                        <option value="false">Chưa Promote</option>
                    </select>
                </div>

                <div className="card">
                    {jobs.length === 0 ? (
                        <div className="empty-state"><p>Không có tin nào đang hoạt động</p></div>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{ width: 40 }}>
                                            <input type="checkbox" 
                                                checked={paginatedJobs.length > 0 && paginatedJobs.every(j => selectedIds.includes(j.jobId))}
                                                onChange={handleSelectAll} 
                                            />
                                        </th>
                                        <th>Tiêu đề</th><th>Công ty</th><th>Ngày nộp</th><th>Trạng thái</th><th>Thao tác</th></tr>
                                </thead>
                                <tbody>
                                    {paginatedJobs.map(job => (
                                        <tr key={job.jobId} style={job.isPromoted ? { backgroundColor: '#fffbeb' } : {}}>
                                            <td>
                                                <input type="checkbox" 
                                                    checked={selectedIds.includes(job.jobId)}
                                                    onChange={() => handleSelectRow(job.jobId)} 
                                                />
                                            </td>
                                            <td>
                                                <button className="link-btn" onClick={() => setSelectedJob(job)}><FiEye size={13} style={{ marginRight: 4 }} />{job.title}</button>
                                                {job.isPromoted && <span className="badge badge-warning" style={{ marginLeft: 8 }}>🔥 Promote</span>}
                                            </td>
                                            <td>{job.companyName}</td>
                                            <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                                            <td><span className={`badge ${getStatusBadge(job.status)}`}>{getStatusLabel(job.status)}</span></td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <button className="btn btn-sm btn-danger" onClick={() => handleCloseJob(job.jobId)}><FiX size={14} /> Đóng tin</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {totalPages > 1 && (
                                <Pagination 
                                    currentPage={currentPage} 
                                    totalPages={totalPages} 
                                    onPageChange={setCurrentPage} 
                                />
                            )}
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
                            
                            <div className="mb-3" style={{ background: '#fffbeb', padding: '12px', borderRadius: '8px', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <strong style={{ color: '#92400e' }}>🔥 Trạng thái Promote</strong>
                                    <p className="text-muted" style={{ fontSize: '13px', margin: 0 }}>Việc làm yêu thích hiển thị ưu tiên.</p>
                                </div>
                                <button 
                                    className={`btn ${selectedJob.isPromoted ? 'btn-danger' : 'btn-secondary'}`} 
                                    onClick={() => handleTogglePromote(selectedJob.jobId)}
                                >
                                    {selectedJob.isPromoted ? 'Tắt Promote' : 'Bật Promote'}
                                </button>
                            </div>

                            <div style={{ display: 'flex', gap: 12 }}>
                                <button className="btn btn-danger btn-lg" style={{ flex: 1 }} onClick={() => handleCloseJob(selectedJob.jobId)}><FiX /> Đóng tin</button>
                                <button className="btn btn-secondary btn-lg" style={{ flex: 1 }} onClick={() => setSelectedJob(null)}>Đóng</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/apiService';
import { FiMapPin, FiBriefcase, FiClock, FiSearch } from 'react-icons/fi';
import './SearchJobsPage.css';

export default function SearchJobsPage() {
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    
    const [jobs, setJobs] = useState([]);
    const [total, setTotal] = useState(0);

    const fetchJobs = async () => {
        try {
            const params = { pageSize: 50 };
            if (keyword) params.keyword = keyword;
            if (location) params.location = location;
            if (jobType) params.jobType = jobType;
            // API hiện tại chưa hỗ trợ sort theo salary, ta có thể tự sort hoặc bổ sung param sau. Hiện tại dùng mặc định.

            const res = await apiService.get('/jobs', { params });
            let items = res.data.items || [];

            // Tự sort trên client cho tiện nếu API chưa hỗ trợ
            if (sortBy === 'salary') {
                items.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
            }

            setJobs(items);
            setTotal(res.data.total || 0);
        } catch (error) {
            console.error('Lỗi lấy tài nguyên:', error);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [location, jobType, sortBy]); // fetch khi filter/sort thay đổi

    // Hardcode location vì không lưu bảng riêng
    const locations = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Remote'];

    return (
        <div className="search-page">
            <div className="search-hero">
                <div className="search-hero-content">
                    <h1>Tìm công việc IT mơ ước của bạn</h1>
                    <div className="search-bar">
                        <input type="text" className="search-input" placeholder="Vị trí, kỹ năng..."
                            value={keyword} onChange={e => setKeyword(e.target.value)} 
                            onKeyDown={e => e.key === 'Enter' && fetchJobs()} />
                        <select className="search-input search-select" value={location} onChange={e => setLocation(e.target.value)}>
                            <option value="">Tất cả địa điểm</option>
                            {locations.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                        <button className="btn btn-primary btn-lg" onClick={fetchJobs}><FiSearch style={{ marginRight: 4 }} /> Tìm kiếm</button>
                    </div>
                </div>
            </div>

            <div className="search-container">
                <aside className="filters card">
                    <h3>Bộ lọc</h3>
                    <div className="filter-group">
                        <h4>Địa điểm</h4>
                        {locations.map(l => (
                            <label className="filter-option" key={l}>
                                <input type="radio" name="location" checked={location === l}
                                    onChange={() => setLocation(location === l ? '' : l)} />
                                {l}
                            </label>
                        ))}
                        {location && <button className="btn-clear" onClick={() => setLocation('')}>Xóa lọc</button>}
                    </div>
                    <div className="filter-group">
                        <h4>Loại hình</h4>
                        {['full-time', 'part-time', 'remote', 'contract'].map(t => (
                            <label className="filter-option" key={t}>
                                <input type="radio" name="jobType" checked={jobType === t}
                                    onChange={() => setJobType(jobType === t ? '' : t)} />
                                {t === 'full-time' ? 'Toàn thời gian' : t === 'part-time' ? 'Bán thời gian' : t === 'remote' ? 'Remote' : 'Hợp đồng'}
                            </label>
                        ))}
                        {jobType && <button className="btn-clear" onClick={() => setJobType('')}>Xóa lọc</button>}
                    </div>
                </aside>

                <main className="results">
                    <div className="results-header">
                        <span>Tìm thấy <strong>{total} việc làm</strong></span>
                        <select className="form-select" style={{ width: 'auto' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                            <option value="newest">Mới nhất</option>
                            <option value="salary">Lương cao nhất</option>
                        </select>
                    </div>
                    <div className="results-list">
                        {jobs.length === 0 && (
                            <div className="no-results card">
                                <p>Không tìm thấy việc làm phù hợp với tiêu chí của bạn</p>
                                <button className="btn btn-secondary btn-sm mt-2" onClick={() => { setKeyword(''); setLocation(''); setJobType(''); fetchJobs(); }}>
                                    Xóa tất cả bộ lọc
                                </button>
                            </div>
                        )}
                        {jobs.map(job => (
                            <Link to={`/jobs/${job.jobId}`} className="job-card card" key={job.jobId}>
                                <div className="job-card-top">
                                    <div className="company-logo">{job.companyName?.substring(0, 3).toUpperCase()}</div>
                                    <div className="job-info">
                                        <h3>{job.title}</h3>
                                        <p className="company-name">{job.companyName}</p>
                                        <div className="job-meta">
                                            <span><FiMapPin size={14} /> {job.location}</span>
                                            <span><FiBriefcase size={14} /> {job.jobType === 'full-time' ? 'Toàn thời gian' : job.jobType === 'remote' ? 'Remote' : job.jobType}</span>
                                            <span><FiClock size={14} /> {new Date(job.createdAt).toLocaleDateString()}</span>
                                            <span className="salary-text">${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="tags">{job.skills?.map(s => <span className="tag" key={s}>{s}</span>)}</div>
                            </Link>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { JOBS, getCompanyById } from '../data/mockData';
import { FiMapPin, FiBriefcase, FiClock, FiSearch } from 'react-icons/fi';
import './SearchJobsPage.css';

export default function SearchJobsPage() {
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    const activeJobs = JOBS.filter(j => j.status === 'active');

    const filtered = activeJobs.filter(job => {
        const matchKeyword = !keyword || job.title.toLowerCase().includes(keyword.toLowerCase()) ||
            job.skills?.some(s => s.toLowerCase().includes(keyword.toLowerCase()));
        const matchLocation = !location || job.location === location;
        const matchType = !jobType || job.job_type === jobType;
        return matchKeyword && matchLocation && matchType;
    });

    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === 'salary') return (b.salary_max || 0) - (a.salary_max || 0);
        return new Date(b.created_at) - new Date(a.created_at);
    });

    const locations = [...new Set(JOBS.map(j => j.location))];

    return (
        <div className="search-page">
            <div className="search-hero">
                <div className="search-hero-content">
                    <h1>Tìm công việc IT mơ ước của bạn</h1>
                    <div className="search-bar">
                        <input type="text" className="search-input" placeholder="Vị trí, kỹ năng, công ty..."
                            value={keyword} onChange={e => setKeyword(e.target.value)} />
                        <select className="search-input search-select" value={location} onChange={e => setLocation(e.target.value)}>
                            <option value="">Tất cả địa điểm</option>
                            {locations.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                        <button className="btn btn-primary btn-lg"><FiSearch style={{ marginRight: 4 }} /> Tìm kiếm</button>
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
                        <span>Tìm thấy <strong>{sorted.length} việc làm</strong></span>
                        <select className="form-select" style={{ width: 'auto' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                            <option value="newest">Mới nhất</option>
                            <option value="salary">Lương cao nhất</option>
                        </select>
                    </div>
                    <div className="results-list">
                        {sorted.length === 0 && (
                            <div className="no-results card">
                                <p>Không tìm thấy việc làm phù hợp với tiêu chí của bạn</p>
                                <button className="btn btn-secondary btn-sm mt-2" onClick={() => { setKeyword(''); setLocation(''); setJobType(''); }}>
                                    Xóa tất cả bộ lọc
                                </button>
                            </div>
                        )}
                        {sorted.map(job => {
                            const company = getCompanyById(job.company_id);
                            return (
                                <Link to={`/jobs/${job.job_id}`} className="job-card card" key={job.job_id}>
                                    <div className="job-card-top">
                                        <div className="company-logo">{company?.company_name?.substring(0, 3).toUpperCase()}</div>
                                        <div className="job-info">
                                            <h3>{job.title}</h3>
                                            <p className="company-name">{company?.company_name}</p>
                                            <div className="job-meta">
                                                <span><FiMapPin size={14} /> {job.location}</span>
                                                <span><FiBriefcase size={14} /> {job.job_type === 'full-time' ? 'Toàn thời gian' : job.job_type === 'remote' ? 'Remote' : job.job_type}</span>
                                                <span><FiClock size={14} /> {job.created_at}</span>
                                                <span className="salary-text">${job.salary_min?.toLocaleString()} - ${job.salary_max?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tags">{job.skills?.map(s => <span className="tag" key={s}>{s}</span>)}</div>
                                </Link>
                            );
                        })}
                    </div>
                </main>
            </div>
        </div>
    );
}

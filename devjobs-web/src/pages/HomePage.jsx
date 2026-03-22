import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/apiService';
import { FiMapPin, FiBriefcase, FiSearch, FiFileText, FiSend, FiArrowRight, FiUsers, FiTrendingUp } from 'react-icons/fi';
import './HomePage.css';

export default function HomePage() {
    const [activeJobs, setActiveJobs] = useState([]);

    useEffect(() => {
        apiService.get('/jobs?pageSize=3').then(res => {
            setActiveJobs(res.data.items);
        }).catch(err => console.error(err));
    }, []);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Tìm công việc IT<br />mơ ước của bạn</h1>
                    <p>Kết nối hàng ngàn Lập trình viên với các Doanh nghiệp IT hàng đầu Việt Nam</p>
                    <div className="hero-search">
                        <input type="text" placeholder="Vị trí, kỹ năng, công ty..." className="hero-input" />
                        <Link to="/jobs" className="btn btn-primary btn-lg"><FiSearch style={{ marginRight: 4 }} /> Tìm kiếm</Link>
                    </div>
                    <div className="hero-stats">
                        <div><strong>500+</strong><span>Việc làm</span></div>
                        <div><strong>200+</strong><span>Công ty</span></div>
                        <div><strong>10,000+</strong><span>Ứng viên</span></div>
                    </div>
                </div>
            </section>

            {/* Featured Jobs */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2>Việc làm nổi bật</h2>
                        <Link to="/jobs" className="view-all">Xem tất cả <FiArrowRight /></Link>
                    </div>
                    <div className="jobs-grid">
                        {activeJobs.map(job => (
                            <Link to={`/jobs/${job.jobId}`} className="job-card" key={job.jobId}>
                                <div className="job-card-header">
                                    <div className="company-logo">{job.companyName?.substring(0, 3).toUpperCase()}</div>
                                    <div>
                                        <h3>{job.title}</h3>
                                        <p className="company-name">{job.companyName}</p>
                                    </div>
                                </div>
                                <div className="job-card-meta">
                                    <span><FiMapPin size={14} /> {job.location}</span>
                                    <span><FiBriefcase size={14} /> {job.jobType === 'full-time' ? 'Toàn thời gian' : job.jobType === 'remote' ? 'Remote' : job.jobType}</span>
                                    <span className="salary">${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()}</span>
                                </div>
                                <div className="tags">
                                    {job.skills?.slice(0, 4).map(s => <span className="tag" key={s}>{s}</span>)}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="section how-it-works">
                <div className="container">
                    <h2 className="text-center mb-3">Cách hoạt động</h2>
                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-icon"><FiFileText /></div>
                            <h3>Tạo hồ sơ</h3>
                            <p>Đăng ký tài khoản và cập nhật CV, kỹ năng của bạn</p>
                        </div>
                        <div className="step-card">
                            <div className="step-icon"><FiSearch /></div>
                            <h3>Tìm kiếm</h3>
                            <p>Tìm việc phù hợp theo kỹ năng, địa điểm, mức lương</p>
                        </div>
                        <div className="step-card">
                            <div className="step-icon"><FiSend /></div>
                            <h3>Ứng tuyển</h3>
                            <p>Nộp CV trực tiếp và theo dõi trạng thái hồ sơ</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

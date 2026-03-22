import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import './DashboardPages.css';

export default function PostJobPage() {
    const navigate = useNavigate();
    const [skills, setSkills] = useState([]);
    const [form, setForm] = useState({
        title: '', description: '', requirements: '', benefits: '',
        salaryMin: '', salaryMax: '', location: 'Hà Nội', jobType: 'full-time',
    });
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        apiService.get('/skills').then(res => setSkills(res.data)).catch(console.error);
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const toggleSkill = (skillId) => {
        setSelectedSkills(prev => prev.includes(skillId) ? prev.filter(id => id !== skillId) : [...prev, skillId]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                ...form,
                salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
                salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
                expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0], // Mặc định 1 tháng
                skillIds: selectedSkills
            };
            await apiService.post('/jobs', payload);
            setSubmitted(true);
        } catch (error) {
            alert(error.response?.data?.message || 'Lỗi khi đăng tin');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="dashboard-page">
                <div className="container">
                    <div className="card text-center" style={{ padding: '60px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                        <h2>Tin tuyển dụng đã được gửi!</h2>
                        <p className="text-muted mt-1">Tin của bạn đang chờ Admin duyệt. Bạn sẽ nhận thông báo khi tin được phê duyệt.</p>
                        <div className="mt-3" style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button className="btn btn-primary" onClick={() => navigate('/recruiter/jobs')}>Xem danh sách tin</button>
                            <button className="btn btn-secondary" onClick={() => { setSubmitted(false); setForm({ title: '', description: '', requirements: '', benefits: '', salaryMin: '', salaryMax: '', location: 'Hà Nội', jobType: 'full-time' }); setSelectedSkills([]); }}>Đăng tin mới</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="page-header">
                    <h1>Đăng tin tuyển dụng</h1>
                    <p>Tạo tin tuyển dụng mới để tìm kiếm ứng viên phù hợp</p>
                </div>
                <div className="card">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Tiêu đề công việc (Job Title) *</label>
                            <input type="text" name="title" className="form-input" value={form.title}
                                onChange={handleChange} required placeholder="VD: Senior React Developer" />
                        </div>
                        <div className="form-group">
                            <label>Kỹ năng yêu cầu (chọn tags)</label>
                            <div className="skill-selector">
                                {skills.map(s => (
                                    <button type="button" key={s.skillId}
                                        className={`skill-tag ${selectedSkills.includes(s.skillId) ? 'active' : ''}`}
                                        onClick={() => toggleSkill(s.skillId)}>
                                        {s.skillName}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Lương tối thiểu ($)</label>
                                <input type="number" name="salaryMin" className="form-input" value={form.salaryMin}
                                    onChange={handleChange} placeholder="VD: 1000" />
                            </div>
                            <div className="form-group">
                                <label>Lương tối đa ($)</label>
                                <input type="number" name="salaryMax" className="form-input" value={form.salaryMax}
                                    onChange={handleChange} placeholder="VD: 2000" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Địa điểm làm việc</label>
                                <select name="location" className="form-select" value={form.location} onChange={handleChange}>
                                    <option>Hà Nội</option>
                                    <option>TP. Hồ Chí Minh</option>
                                    <option>Đà Nẵng</option>
                                    <option>Remote</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Loại hình công việc</label>
                                <select name="jobType" className="form-select" value={form.jobType} onChange={handleChange}>
                                    <option value="full-time">Toàn thời gian</option>
                                    <option value="part-time">Bán thời gian</option>
                                    <option value="remote">Remote</option>
                                    <option value="contract">Hợp đồng</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Mô tả công việc *</label>
                            <textarea name="description" className="form-textarea" rows="5" value={form.description}
                                onChange={handleChange} required placeholder="Mô tả chi tiết công việc..." />
                        </div>
                        <div className="form-group">
                            <label>Yêu cầu ứng viên *</label>
                            <textarea name="requirements" className="form-textarea" rows="5" value={form.requirements}
                                onChange={handleChange} required placeholder="Mỗi yêu cầu trên 1 dòng..." />
                        </div>
                        <div className="form-group">
                            <label>Quyền lợi</label>
                            <textarea name="benefits" className="form-textarea" rows="4" value={form.benefits}
                                onChange={handleChange} placeholder="Mỗi quyền lợi trên 1 dòng..." />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                            {submitting ? 'Đang gửi...' : 'Đăng tin tuyển dụng'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

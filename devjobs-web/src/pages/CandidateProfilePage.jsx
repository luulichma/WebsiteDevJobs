import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './DashboardPages.css';

export default function CandidateProfilePage() {
    const { user } = useAuth();
    const [form, setForm] = useState({
        full_name: user?.full_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: 'Hà Nội, Việt Nam',
        skills: user?.skills?.join(', ') || '',
        experience: 'Công ty ABC - Frontend Developer (2024-2026)\nFreelance Web Developer (2023-2024)',
    });
    const [saved, setSaved] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 3000); };

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="page-header">
                    <h1>Hồ sơ cá nhân</h1>
                    <p>Cập nhật thông tin để nhà tuyển dụng dễ dàng tìm thấy bạn</p>
                </div>
                {saved && <div className="alert alert-success">✅ Cập nhật thông tin thành công!</div>}
                <div className="card">
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Họ và tên</label>
                                <input type="text" name="full_name" className="form-input" value={form.full_name} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" name="email" className="form-input" value={form.email} onChange={handleChange} readOnly />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Số điện thoại</label>
                                <input type="tel" name="phone" className="form-input" value={form.phone} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Địa chỉ</label>
                                <input type="text" name="address" className="form-input" value={form.address} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>CV mẫu (PDF/DOCX, tối đa 5MB)</label>
                            <input type="file" className="form-input" accept=".pdf,.doc,.docx" style={{ border: '2px dashed #d1d5db' }} />
                        </div>
                        <div className="form-group">
                            <label>Kỹ năng (cách nhau bằng dấu phẩy)</label>
                            <input type="text" name="skills" className="form-input" value={form.skills} onChange={handleChange}
                                placeholder="React, Node.js, JavaScript..." />
                        </div>
                        <div className="form-group">
                            <label>Kinh nghiệm làm việc</label>
                            <textarea name="experience" className="form-textarea" rows="4" value={form.experience} onChange={handleChange} />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg">Lưu thay đổi</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

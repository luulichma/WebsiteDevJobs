import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import { FiSave, FiUpload, FiCheckCircle } from 'react-icons/fi';
import './DashboardPages.css';

export default function CandidateProfilePage() {
    const { user } = useAuth();
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        skills: '',
        cvUrl: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Fetch profile từ API khi mount
    useEffect(() => {
        apiService.get('/users/me')
            .then(res => {
                const u = res.data;
                setForm({
                    fullName: u.fullName || '',
                    email: u.email || '',
                    phone: u.phone || '',
                    skills: u.skills?.join(', ') || '',
                    cvUrl: u.cvUrl || '',
                });
            })
            .catch(err => console.error('Lỗi tải hồ sơ:', err))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                fullName: form.fullName,
                phone: form.phone,
                cvUrl: form.cvUrl,
                skills: form.skills.split(',').map(s => s.trim()).filter(s => s)
            };
            await apiService.put('/users/me', payload);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi cập nhật hồ sơ');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="container mt-3">Đang tải hồ sơ...</div>;

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="page-header">
                    <h1>Hồ sơ cá nhân</h1>
                    <p>Cập nhật thông tin để nhà tuyển dụng dễ dàng tìm thấy bạn</p>
                </div>
                {saved && <div className="alert alert-success"><FiCheckCircle style={{ marginRight: 6 }} /> Cập nhật thông tin thành công!</div>}
                <div className="card">
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Họ và tên</label>
                                <input type="text" name="fullName" className="form-input" value={form.fullName} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" name="email" className="form-input" value={form.email} readOnly
                                    style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Số điện thoại</label>
                                <input type="tel" name="phone" className="form-input" value={form.phone} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Đường dẫn CV (URL)</label>
                                <input type="text" name="cvUrl" className="form-input" value={form.cvUrl} onChange={handleChange}
                                    placeholder="https://drive.google.com/cv-cua-ban.pdf" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Kỹ năng (cách nhau bằng dấu phẩy)</label>
                            <input type="text" name="skills" className="form-input" value={form.skills} onChange={handleChange}
                                placeholder="React, Node.js, JavaScript..." />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                            <FiSave size={16} style={{ marginRight: 6 }} />
                            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

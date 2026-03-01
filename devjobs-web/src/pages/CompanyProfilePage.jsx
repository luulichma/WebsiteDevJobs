import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { COMPANIES } from '../data/mockData';
import './DashboardPages.css';

export default function CompanyProfilePage() {
    const { user } = useAuth();
    const company = COMPANIES.find(c => c.created_by === user?.user_id);
    const [form, setForm] = useState({
        company_name: company?.company_name || '',
        description: company?.description || '',
        website: company?.website || '',
        address: company?.address || '',
    });
    const [saved, setSaved] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 3000); };

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="page-header">
                    <h1>Quản lý thông tin Công ty</h1>
                    <p>Cập nhật hồ sơ công ty để ứng viên tìm hiểu về doanh nghiệp</p>
                </div>
                {saved && <div className="alert alert-success">✅ Cập nhật thông tin công ty thành công!</div>}
                <div className="card">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Tên công ty *</label>
                            <input type="text" name="company_name" className="form-input" value={form.company_name}
                                onChange={handleChange} required placeholder="Nhập tên công ty" />
                        </div>
                        <div className="form-group">
                            <label>Mô tả về công ty *</label>
                            <textarea name="description" className="form-textarea" rows="4" value={form.description}
                                onChange={handleChange} required placeholder="Giới thiệu về công ty..." />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Website</label>
                                <input type="url" name="website" className="form-input" value={form.website}
                                    onChange={handleChange} placeholder="https://example.com" />
                            </div>
                            <div className="form-group">
                                <label>Địa chỉ</label>
                                <input type="text" name="address" className="form-input" value={form.address} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Logo công ty (JPG/PNG, tối đa 2MB)</label>
                            <input type="file" className="form-input" accept="image/*" style={{ border: '2px dashed #d1d5db' }} />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg">Lưu thông tin</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import { FiSave, FiCheckCircle, FiPlusCircle } from 'react-icons/fi';
import './DashboardPages.css';

export default function CompanyProfilePage() {
    const { user } = useAuth();
    const [form, setForm] = useState({
        companyName: '',
        description: '',
        website: '',
        address: '',
    });
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [hasCompany, setHasCompany] = useState(!!user?.companyId);

    useEffect(() => {
        if (user?.companyId) {
            apiService.get(`/companies/${user.companyId}`).then(res => {
                setForm({
                    companyName: res.data.companyName || '',
                    description: res.data.description || '',
                    website: res.data.website || '',
                    address: res.data.address || ''
                });
                setHasCompany(true);
            }).catch(e => console.error(e)).finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await apiService.post('/companies', form);
            setSaved(true);
            setHasCompany(true);
            // Cập nhật companyId trong localStorage
            const storedUser = JSON.parse(localStorage.getItem('devjobs_user') || '{}');
            storedUser.companyId = res.data.companyId;
            localStorage.setItem('devjobs_user', JSON.stringify(storedUser));
            setTimeout(() => setSaved(false), 3000);
        } catch (e) {
            alert(e.response?.data?.message || 'Lỗi tạo công ty');
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiService.put('/companies/my', form);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (e) {
            alert(e.response?.data?.message || 'Lỗi lưu thông tin');
        }
    };

    if (loading) return <div className="container mt-3">Đang tải...</div>;

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="page-header">
                    <h1>Quản lý thông tin Công ty</h1>
                    <p>Cập nhật hồ sơ công ty để ứng viên tìm hiểu về doanh nghiệp</p>
                </div>
                {saved && <div className="alert alert-success"><FiCheckCircle style={{ marginRight: 6 }} /> {hasCompany ? 'Cập nhật thông tin công ty thành công!' : 'Tạo công ty thành công!'}</div>}

                {!hasCompany && (
                    <div className="alert alert-warning mb-3">
                        <FiPlusCircle style={{ marginRight: 6 }} /> Bạn chưa có hồ sơ công ty. Hãy điền thông tin bên dưới để tạo mới!
                    </div>
                )}

                <div className="card">
                    <form onSubmit={hasCompany ? handleSubmit : handleCreate}>
                        <div className="form-group">
                            <label>Tên công ty *</label>
                            <input type="text" name="companyName" className="form-input" value={form.companyName}
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
                        <button type="submit" className="btn btn-primary btn-lg">
                            <FiSave size={16} style={{ marginRight: 6 }} />
                            {hasCompany ? 'Lưu thông tin' : 'Tạo công ty mới'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

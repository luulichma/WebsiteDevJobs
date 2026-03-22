import { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { FiSearch, FiLock, FiUnlock, FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import './DashboardPages.css';

const getStatusBadge = (status) => status === 'active' ? 'badge-success' : 'badge-danger';
const getStatusLabel = (status) => status === 'active' ? 'Hoạt động' : 'Bị khóa';

export default function AdminManageUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [confirmEmail, setConfirmEmail] = useState('');
    const [deleteError, setDeleteError] = useState('');

    useEffect(() => {
        apiService.get('/users').then(res => setUsers(res.data)).catch(console.error).finally(() => setLoading(false));
    }, []);

    const filtered = users.filter(u => {
        const matchSearch = !search || u.fullName.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === 'all' || u.role === roleFilter;
        return matchSearch && matchRole;
    });

    const handleDelete = async () => {
        if (confirmEmail !== deleteTarget?.email) {
            setDeleteError('Email xác nhận không chính xác!');
            return;
        }
        try {
            await apiService.delete(`/users/${deleteTarget.userId}`);
            setUsers(prev => prev.filter(u => u.userId !== deleteTarget.userId));
            setDeleteTarget(null);
            setConfirmEmail('');
            setDeleteError('');
        } catch (error) {
            setDeleteError(error.response?.data?.message || 'Xóa thất bại');
        }
    };

    const toggleSuspend = async (userId) => {
        try {
            await apiService.put(`/users/${userId}/suspend`);
            setUsers(prev => prev.map(u => {
                if (u.userId === userId) {
                    return { ...u, status: u.status === 'active' ? 'suspended' : 'active' };
                }
                return u;
            }));
        } catch (error) {
            alert('Lỗi thay đổi trạng thái');
        }
    };

    if (loading) return <div className="container mt-3">Đang tải danh sách...</div>;

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="page-header">
                    <h1>Quản lý người dùng</h1>
                    <p>Xem danh sách và quản lý tài khoản người dùng</p>
                </div>

                <div className="card mb-3">
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
                            <FiSearch size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                            <input type="text" className="form-input" placeholder="Tìm theo tên hoặc email..."
                                value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
                        </div>
                        <select className="form-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ width: 'auto' }}>
                            <option value="all">Tất cả vai trò</option>
                            <option value="candidate">Ứng viên</option>
                            <option value="recruiter">Nhà tuyển dụng</option>
                        </select>
                    </div>
                </div>

                <div className="card">
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr><th>ID</th><th>Họ tên</th><th>Email</th><th>Vai trò</th><th>Trạng thái</th><th>Ngày tạo</th><th>Thao tác</th></tr>
                            </thead>
                            <tbody>
                                {filtered.map(u => (
                                    <tr key={u.userId}>
                                        <td>#{u.userId}</td>
                                        <td><strong>{u.fullName}</strong></td>
                                        <td>{u.email}</td>
                                        <td>{u.role === 'candidate' ? 'Ứng viên' : 'NTD'}</td>
                                        <td><span className={`badge ${getStatusBadge(u.status)}`}>{getStatusLabel(u.status)}</span></td>
                                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button className={`btn btn-sm ${u.status === 'active' ? 'btn-warning' : 'btn-success'}`}
                                                    onClick={() => toggleSuspend(u.userId)}>
                                                    {u.status === 'active' ? <><FiLock size={13} /> Khóa</> : <><FiUnlock size={13} /> Mở</>}
                                                </button>
                                                <button className="btn btn-sm btn-danger" onClick={() => { setDeleteTarget(u); setConfirmEmail(''); setDeleteError(''); }}>
                                                    <FiTrash2 size={13} /> Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="text-muted mt-2" style={{ fontSize: 13 }}>Hiển thị {filtered.length} người dùng</div>
                </div>

                {/* Delete Confirmation Modal */}
                {deleteTarget && (
                    <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <h3><FiAlertTriangle size={20} color="#f59e0b" /> Xác nhận xóa tài khoản</h3>
                            <p className="text-muted mt-1">
                                Bạn đang xóa tài khoản của <strong>{deleteTarget.fullName}</strong>. Hành động này không thể hoàn tác.
                            </p>
                            <div className="form-group mt-2">
                                <label>Nhập email để xác nhận xóa:</label>
                                <input type="email" className="form-input" placeholder={deleteTarget.email}
                                    value={confirmEmail} onChange={e => { setConfirmEmail(e.target.value); setDeleteError(''); }} />
                            </div>
                            {deleteError && <div className="alert alert-danger">{deleteError}</div>}
                            <div style={{ display: 'flex', gap: 12 }}>
                                <button className="btn btn-danger" onClick={handleDelete}><FiTrash2 size={14} /> Xác nhận xóa</button>
                                <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Hủy</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

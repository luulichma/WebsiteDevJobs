import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApplicationsByCandidate, JOBS, getCompanyById, getStatusLabel, getStatusBadge } from '../data/mockData';
import './DashboardPages.css';

export default function ApplicationHistoryPage() {
    const { user } = useAuth();
    const apps = getApplicationsByCandidate(user?.user_id);

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="page-header">
                    <h1>Lịch sử ứng tuyển</h1>
                    <p>Theo dõi trạng thái các hồ sơ đã nộp</p>
                </div>
                <div className="card">
                    {apps.length === 0 ? (
                        <div className="empty-state">
                            <p>Bạn chưa ứng tuyển công việc nào</p>
                            <Link to="/jobs" className="btn btn-primary mt-2">Tìm việc ngay</Link>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr><th>Vị trí</th><th>Công ty</th><th>Ngày nộp</th><th>Trạng thái</th><th>Thao tác</th></tr>
                                </thead>
                                <tbody>
                                    {apps.map(app => {
                                        const job = JOBS.find(j => j.job_id === app.job_id);
                                        const company = job ? getCompanyById(job.company_id) : null;
                                        return (
                                            <tr key={app.application_id}>
                                                <td><Link to={`/jobs/${app.job_id}`} style={{ color: '#667eea', fontWeight: 500 }}>{job?.title || 'N/A'}</Link></td>
                                                <td>{company?.company_name || 'N/A'}</td>
                                                <td>{app.applied_at}</td>
                                                <td><span className={`badge ${getStatusBadge(app.status)}`}>{getStatusLabel(app.status)}</span></td>
                                                <td>
                                                    {app.status === 'pending' && <button className="btn btn-sm btn-secondary">Cập nhật CV</button>}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import { ArrowLeft, Clock, User, Activity, Filter } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/auth-context';
import { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function Logs() {
  const navigate = useNavigate();
  const { logs, user } = useAuth();
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'employee'>('all');
  const [filterAction, setFilterAction] = useState<string>('all');

  // Redirect if not admin
  if (user?.role !== 'admin') {
    navigate('/home');
    return null;
  }

  // Get unique actions for filter
  const uniqueActions = Array.from(new Set(logs.map(log => log.action)));

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const roleMatch = filterRole === 'all' || log.role === filterRole;
    const actionMatch = filterAction === 'all' || log.action === filterAction;
    return roleMatch && actionMatch;
  });

  const getRoleBadgeColor = (role: string) => {
    return role === 'admin' 
      ? 'bg-purple-100 text-purple-700 border-purple-300' 
      : 'bg-blue-100 text-blue-700 border-blue-300';
  };

  const getActionColor = (action: string) => {
    const colors: { [key: string]: string } = {
      'Đăng nhập': 'text-green-600',
      'Đăng xuất': 'text-gray-600',
      'Thay đổi nhiệt độ': 'text-red-600',
      'Thay đổi độ ẩm': 'text-blue-600',
      'Thay đổi ánh sáng': 'text-yellow-600',
      'Bật máy': 'text-green-600',
      'Tắt máy': 'text-gray-600',
      'Mở cửa': 'text-orange-600',
      'Đóng cửa': 'text-gray-600',
    };
    return colors[action] || 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 p-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 px-4 py-2 mb-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="size-5" />
            <span>Quay lại</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Nhật Ký Hoạt Động
              </h1>
              <p className="text-gray-600">
                Theo dõi tất cả các hoạt động và thay đổi trong hệ thống
              </p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-lg border border-purple-300">
              <Activity className="size-5 text-purple-700" />
              <span className="font-medium text-purple-700">
                {filteredLogs.length} hoạt động
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="size-5 text-gray-600" />
            <h2 className="font-semibold text-gray-800">Bộ lọc</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vai trò
              </label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="admin">Quản trị viên</option>
                <option value="employee">Nhân viên</option>
              </select>
            </div>

            {/* Action Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hành động
              </label>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="all">Tất cả hành động</option>
                {uniqueActions.map(action => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Máy sấy
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chi tiết
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Không có hoạt động nào
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="size-4" />
                          <span>
                            {format(log.timestamp, 'dd/MM/yyyy HH:mm:ss', { locale: vi })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User className="size-4 text-gray-500" />
                          <span className="font-medium text-gray-800">{log.user}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(log.role)}`}>
                          {log.role === 'admin' ? 'Admin' : 'Nhân viên'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-medium ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.machineId ? (
                          <span className="text-sm text-gray-700">
                            Máy #{log.machineId} - {log.machineName}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{log.details}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

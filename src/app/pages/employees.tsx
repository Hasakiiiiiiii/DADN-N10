import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, UserPlus, Trash2, Users } from 'lucide-react';
import { useAuth } from '../contexts/auth-context';

export default function Employees() {
  const navigate = useNavigate();
  const { user, employees, addEmployee, removeEmployee, addLog } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if not admin
  if (user?.role !== 'admin') {
    navigate('/home');
    return null;
  }

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu');
      return;
    }

    if (username.length < 3) {
      setError('Tên đăng nhập phải có ít nhất 3 ký tự');
      return;
    }

    if (password.length < 3) {
      setError('Mật khẩu phải có ít nhất 3 ký tự');
      return;
    }

    const result = addEmployee(username, password);
    if (result) {
      setSuccess(`Đã thêm nhân viên "${username}" thành công!`);
      addLog('Quản lý nhân viên', undefined, undefined, `Thêm nhân viên: ${username}`);
      setUsername('');
      setPassword('');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError('Tên đăng nhập đã tồn tại');
    }
  };

  const handleRemoveEmployee = (empUsername: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa nhân viên "${empUsername}"?`)) {
      removeEmployee(empUsername);
      addLog('Quản lý nhân viên', undefined, undefined, `Xóa nhân viên: ${empUsername}`);
      setSuccess(`Đã xóa nhân viên "${empUsername}" thành công!`);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/home')}
              className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft className="size-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                <Users className="size-10 text-purple-600" />
                Quản Lý Nhân Viên
              </h1>
              <p className="text-gray-600 mt-2">
                Thêm và xóa tài khoản nhân viên
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Add Employee Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 rounded-full">
                <UserPlus className="size-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Thêm Nhân Viên Mới
              </h2>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="Nhập tên đăng nhập..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="Nhập mật khẩu..."
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">{success}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Thêm Nhân Viên
              </button>
            </form>
          </div>

          {/* Employee List */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="size-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Danh Sách Nhân Viên
              </h2>
            </div>

            <div className="space-y-3">
              {/* Default Employee */}
              <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">employee</p>
                    <p className="text-sm text-gray-500">Tài khoản mặc định</p>
                  </div>
                  <div className="px-3 py-1 bg-gray-300 text-gray-600 rounded-full text-xs font-medium">
                    Mặc định
                  </div>
                </div>
              </div>

              {/* Registered Employees */}
              {employees.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="size-12 mx-auto mb-3 opacity-50" />
                  <p>Chưa có nhân viên nào được đăng ký</p>
                </div>
              ) : (
                employees.map((emp) => (
                  <div
                    key={emp.username}
                    className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200 hover:border-purple-400 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 mb-1">
                          {emp.username}
                        </p>
                        <p className="text-sm text-gray-600">
                          Mật khẩu: <span className="font-mono">{emp.password}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveEmployee(emp.username)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        title="Xóa nhân viên"
                      >
                        <Trash2 className="size-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {employees.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700 text-center">
                  Tổng số nhân viên: <span className="font-bold">{employees.length + 1}</span> (bao gồm tài khoản mặc định)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

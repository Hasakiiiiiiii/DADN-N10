import { useNavigate } from 'react-router';
import { Settings, BarChart3, FileText, LogOut, Users, Key, Usb } from 'lucide-react';
import { useAuth } from '../contexts/auth-context';

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Hệ Thống Quản Lý Máy Sấy Trái Cây
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Điều khiển và theo dõi hoạt động của các máy sấy
          </p>
          
          {/* User Info */}
          <div className="flex items-center justify-center gap-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
              <span className="text-sm text-gray-600">Xin chào,</span>
              <span className="font-bold text-gray-800">{user?.username}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                user?.role === 'admin' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {user?.role === 'admin' ? 'Admin' : 'Nhân viên'}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
            >
              <LogOut className="size-4" />
              <span className="text-sm">Đăng xuất</span>
            </button>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className={`grid ${user?.role === 'admin' ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
          {/* Control Button */}
          <button
            onClick={() => navigate('/control')}
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-500 transform hover:scale-105"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="p-6 bg-green-100 rounded-full group-hover:bg-green-500 transition-colors duration-300">
                <Settings className="size-16 text-green-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Thông Tin Máy
                </h2>
                <p className="text-gray-600">
                  Điều khiển nhiệt độ, độ ẩm, ánh sáng và cửa máy sấy
                </p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          </button>

          {/* Statistics Button */}
          <button
            onClick={() => navigate('/statistics')}
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-500 transform hover:scale-105"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="p-6 bg-blue-100 rounded-full group-hover:bg-blue-500 transition-colors duration-300">
                <BarChart3 className="size-16 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Thống Kê
                </h2>
                <p className="text-gray-600">
                  Xem báo cáo và phân tích dữ liệu theo giờ/ngày
                </p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          </button>

          {/* Yolobit Connect Button - For all users */}
          <button
            onClick={() => navigate('/yolobit')}
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-cyan-500 transform hover:scale-105"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="p-6 bg-cyan-100 rounded-full group-hover:bg-cyan-500 transition-colors duration-300">
                <Usb className="size-16 text-cyan-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Kết Nối Yolobit
                </h2>
                <p className="text-gray-600">
                  Kết nối mạch cảm biến để đọc dữ liệu thực tế
                </p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          </button>

          {/* Change Password Button - For all users */}
          <button
            onClick={() => navigate('/change-password')}
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-orange-500 transform hover:scale-105"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="p-6 bg-orange-100 rounded-full group-hover:bg-orange-500 transition-colors duration-300">
                <Key className="size-16 text-orange-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Đổi Mật Khẩu
                </h2>
                <p className="text-gray-600">
                  Thay đổi mật khẩu bảo mật tài khoản
                </p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          </button>

          {/* Employee Management Button - Only for Admin */}
          {user?.role === 'admin' && (
            <button
              onClick={() => navigate('/employees')}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-pink-500 transform hover:scale-105"
            >
              <div className="flex flex-col items-center gap-6">
                <div className="p-6 bg-pink-100 rounded-full group-hover:bg-pink-500 transition-colors duration-300">
                  <Users className="size-16 text-pink-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Quản Lý Nhân Viên
                  </h2>
                  <p className="text-gray-600">
                    Thêm và xóa tài khoản nhân viên
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </button>
          )}

          {/* Logs Button - Only for Admin */}
          {user?.role === 'admin' && (
            <button
              onClick={() => navigate('/logs')}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-500 transform hover:scale-105"
            >
              <div className="flex flex-col items-center gap-6">
                <div className="p-6 bg-purple-100 rounded-full group-hover:bg-purple-500 transition-colors duration-300">
                  <FileText className="size-16 text-purple-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Nhật Ký
                  </h2>
                  <p className="text-gray-600">
                    Theo dõi hoạt động và thay đổi của người dùng
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </button>
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm text-gray-700">Hệ thống đang hoạt động</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
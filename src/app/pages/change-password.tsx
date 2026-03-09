import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/auth-context';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export default function ChangePassword() {
  const navigate = useNavigate();
  const { user, changePassword } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (newPassword.length < 3) {
      setError('Mật khẩu mới phải có ít nhất 3 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    if (oldPassword === newPassword) {
      setError('Mật khẩu mới phải khác mật khẩu cũ');
      return;
    }

    // Attempt to change password
    const result = changePassword(oldPassword, newPassword);

    if (result) {
      setSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } else {
      setError('Mật khẩu cũ không chính xác');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="size-5" />
          <span>Quay lại trang chủ</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <Lock className="size-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Đổi Mật Khẩu
            </h1>
            <p className="text-gray-600">
              Thay đổi mật khẩu cho tài khoản <span className="font-semibold">{user?.username}</span>
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="size-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-green-800 font-medium">Đổi mật khẩu thành công!</p>
                <p className="text-green-600 text-sm">Đang chuyển về trang chủ...</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <XCircle className="size-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Old Password */}
            <div className="space-y-2">
              <Label htmlFor="oldPassword" className="text-gray-700">
                Mật khẩu cũ
              </Label>
              <div className="relative">
                <Input
                  id="oldPassword"
                  type={showOldPassword ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="pr-10"
                  placeholder="Nhập mật khẩu cũ"
                  disabled={success}
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showOldPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-gray-700">
                Mật khẩu mới
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
                  placeholder="Nhập mật khẩu mới"
                  disabled={success}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showNewPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700">
                Xác nhận mật khẩu mới
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                  placeholder="Nhập lại mật khẩu mới"
                  disabled={success}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Yêu cầu mật khẩu:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 3 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Ít nhất 3 ký tự
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${newPassword && oldPassword && newPassword !== oldPassword ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Khác mật khẩu cũ
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${newPassword && confirmPassword && newPassword === confirmPassword ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Khớp với xác nhận mật khẩu
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6"
              disabled={success}
            >
              <Lock className="size-5 mr-2" />
              Đổi Mật Khẩu
            </Button>
          </form>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Lưu ý:</span> Sau khi đổi mật khẩu, bạn sẽ cần sử dụng mật khẩu mới để đăng nhập lần sau.
          </p>
        </div>
      </div>
    </div>
  );
}

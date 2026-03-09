import { useState } from 'react';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Danh sách máy sấy
const dryers = [
  { id: 'all', name: 'Tất cả máy', fruit: 'Tổng hợp' },
  { id: '001', name: 'Máy #001', fruit: 'Xoài' },
  { id: '002', name: 'Máy #002', fruit: 'Chuối' },
  { id: '003', name: 'Máy #003', fruit: 'Dứa' },
  { id: '004', name: 'Máy #004', fruit: 'Nhãn' },
  { id: '005', name: 'Máy #005', fruit: 'Thanh Long' },
  { id: '006', name: 'Máy #006', fruit: 'Ổi' },
  { id: '007', name: 'Máy #007', fruit: 'Mít' },
  { id: '008', name: 'Máy #008', fruit: 'Vải' },
];

// Mock data theo giờ cho từng máy
const hourlyDataByMachine: { [key: string]: any[] } = {
  all: [
    { time: '00:00', temperature: 62, humidity: 48, light: 75 },
    { time: '02:00', temperature: 64, humidity: 50, light: 78 },
    { time: '04:00', temperature: 63, humidity: 49, light: 76 },
    { time: '06:00', temperature: 65, humidity: 47, light: 80 },
    { time: '08:00', temperature: 68, humidity: 45, light: 85 },
    { time: '10:00', temperature: 70, humidity: 43, light: 88 },
    { time: '12:00', temperature: 72, humidity: 42, light: 90 },
    { time: '14:00', temperature: 71, humidity: 44, light: 87 },
    { time: '16:00', temperature: 69, humidity: 46, light: 83 },
    { time: '18:00', temperature: 66, humidity: 48, light: 80 },
    { time: '20:00', temperature: 64, humidity: 50, light: 77 },
    { time: '22:00', temperature: 63, humidity: 51, light: 75 },
  ],
  '001': [
    { time: '00:00', temperature: 64, humidity: 44, light: 79 },
    { time: '02:00', temperature: 65, humidity: 45, light: 81 },
    { time: '04:00', temperature: 64, humidity: 46, light: 80 },
    { time: '06:00', temperature: 66, humidity: 44, light: 82 },
    { time: '08:00', temperature: 69, humidity: 43, light: 85 },
    { time: '10:00', temperature: 71, humidity: 42, light: 88 },
    { time: '12:00', temperature: 73, humidity: 41, light: 90 },
    { time: '14:00', temperature: 72, humidity: 42, light: 88 },
    { time: '16:00', temperature: 70, humidity: 44, light: 85 },
    { time: '18:00', temperature: 68, humidity: 45, light: 82 },
    { time: '20:00', temperature: 66, humidity: 46, light: 80 },
    { time: '22:00', temperature: 65, humidity: 47, light: 79 },
  ],
  '002': [
    { time: '00:00', temperature: 59, humidity: 49, light: 69 },
    { time: '02:00', temperature: 60, humidity: 50, light: 70 },
    { time: '04:00', temperature: 59, humidity: 51, light: 69 },
    { time: '06:00', temperature: 61, humidity: 49, light: 71 },
    { time: '08:00', temperature: 63, humidity: 48, light: 73 },
    { time: '10:00', temperature: 65, humidity: 47, light: 75 },
    { time: '12:00', temperature: 67, humidity: 46, light: 77 },
    { time: '14:00', temperature: 66, humidity: 47, light: 76 },
    { time: '16:00', temperature: 64, humidity: 48, light: 74 },
    { time: '18:00', temperature: 62, humidity: 49, light: 72 },
    { time: '20:00', temperature: 60, humidity: 50, light: 70 },
    { time: '22:00', temperature: 59, humidity: 51, light: 69 },
  ],
  '003': [
    { time: '00:00', temperature: 69, humidity: 39, light: 84 },
    { time: '02:00', temperature: 70, humidity: 40, light: 85 },
    { time: '04:00', temperature: 69, humidity: 41, light: 84 },
    { time: '06:00', temperature: 71, humidity: 39, light: 86 },
    { time: '08:00', temperature: 73, humidity: 38, light: 88 },
    { time: '10:00', temperature: 75, humidity: 37, light: 90 },
    { time: '12:00', temperature: 77, humidity: 36, light: 92 },
    { time: '14:00', temperature: 76, humidity: 37, light: 91 },
    { time: '16:00', temperature: 74, humidity: 38, light: 89 },
    { time: '18:00', temperature: 72, humidity: 39, light: 87 },
    { time: '20:00', temperature: 70, humidity: 40, light: 85 },
    { time: '22:00', temperature: 69, humidity: 41, light: 84 },
  ],
  '004': [
    { time: '00:00', temperature: 54, humidity: 54, light: 74 },
    { time: '02:00', temperature: 55, humidity: 55, light: 75 },
    { time: '04:00', temperature: 54, humidity: 56, light: 74 },
    { time: '06:00', temperature: 56, humidity: 54, light: 76 },
    { time: '08:00', temperature: 58, humidity: 53, light: 78 },
    { time: '10:00', temperature: 60, humidity: 52, light: 80 },
    { time: '12:00', temperature: 62, humidity: 51, light: 82 },
    { time: '14:00', temperature: 61, humidity: 52, light: 81 },
    { time: '16:00', temperature: 59, humidity: 53, light: 79 },
    { time: '18:00', temperature: 57, humidity: 54, light: 77 },
    { time: '20:00', temperature: 55, humidity: 55, light: 75 },
    { time: '22:00', temperature: 54, humidity: 56, light: 74 },
  ],
  '005': [
    { time: '00:00', temperature: 67, humidity: 47, light: 89 },
    { time: '02:00', temperature: 68, humidity: 48, light: 90 },
    { time: '04:00', temperature: 67, humidity: 49, light: 89 },
    { time: '06:00', temperature: 69, humidity: 47, light: 91 },
    { time: '08:00', temperature: 71, humidity: 46, light: 92 },
    { time: '10:00', temperature: 73, humidity: 45, light: 94 },
    { time: '12:00', temperature: 75, humidity: 44, light: 95 },
    { time: '14:00', temperature: 74, humidity: 45, light: 94 },
    { time: '16:00', temperature: 72, humidity: 46, light: 92 },
    { time: '18:00', temperature: 70, humidity: 47, light: 90 },
    { time: '20:00', temperature: 68, humidity: 48, light: 89 },
    { time: '22:00', temperature: 67, humidity: 49, light: 88 },
  ],
  '006': [
    { time: '00:00', temperature: 61, humidity: 51, light: 64 },
    { time: '02:00', temperature: 62, humidity: 52, light: 65 },
    { time: '04:00', temperature: 61, humidity: 53, light: 64 },
    { time: '06:00', temperature: 63, humidity: 51, light: 66 },
    { time: '08:00', temperature: 65, humidity: 50, light: 68 },
    { time: '10:00', temperature: 67, humidity: 49, light: 70 },
    { time: '12:00', temperature: 69, humidity: 48, light: 72 },
    { time: '14:00', temperature: 68, humidity: 49, light: 71 },
    { time: '16:00', temperature: 66, humidity: 50, light: 69 },
    { time: '18:00', temperature: 64, humidity: 51, light: 67 },
    { time: '20:00', temperature: 62, humidity: 52, light: 65 },
    { time: '22:00', temperature: 61, humidity: 53, light: 64 },
  ],
  '007': [
    { time: '00:00', temperature: 71, humidity: 41, light: 87 },
    { time: '02:00', temperature: 72, humidity: 42, light: 88 },
    { time: '04:00', temperature: 71, humidity: 43, light: 87 },
    { time: '06:00', temperature: 73, humidity: 41, light: 89 },
    { time: '08:00', temperature: 75, humidity: 40, light: 91 },
    { time: '10:00', temperature: 77, humidity: 39, light: 93 },
    { time: '12:00', temperature: 79, humidity: 38, light: 94 },
    { time: '14:00', temperature: 78, humidity: 39, light: 93 },
    { time: '16:00', temperature: 76, humidity: 40, light: 91 },
    { time: '18:00', temperature: 74, humidity: 41, light: 89 },
    { time: '20:00', temperature: 72, humidity: 42, light: 88 },
    { time: '22:00', temperature: 71, humidity: 43, light: 87 },
  ],
  '008': [
    { time: '00:00', temperature: 57, humidity: 57, light: 71 },
    { time: '02:00', temperature: 58, humidity: 58, light: 72 },
    { time: '04:00', temperature: 57, humidity: 59, light: 71 },
    { time: '06:00', temperature: 59, humidity: 57, light: 73 },
    { time: '08:00', temperature: 61, humidity: 56, light: 75 },
    { time: '10:00', temperature: 63, humidity: 55, light: 77 },
    { time: '12:00', temperature: 65, humidity: 54, light: 79 },
    { time: '14:00', temperature: 64, humidity: 55, light: 78 },
    { time: '16:00', temperature: 62, humidity: 56, light: 76 },
    { time: '18:00', temperature: 60, humidity: 57, light: 74 },
    { time: '20:00', temperature: 58, humidity: 58, light: 72 },
    { time: '22:00', temperature: 57, humidity: 59, light: 71 },
  ],
};

// Mock data theo ngày cho từng máy
const dailyDataByMachine: { [key: string]: any[] } = {
  all: [
    { date: 'T2', temperature: 65, humidity: 47, light: 82 },
    { date: 'T3', temperature: 67, humidity: 46, light: 84 },
    { date: 'T4', temperature: 66, humidity: 48, light: 81 },
    { date: 'T5', temperature: 68, humidity: 45, light: 86 },
    { date: 'T6', temperature: 70, humidity: 44, light: 88 },
    { date: 'T7', temperature: 69, humidity: 46, light: 85 },
    { date: 'CN', temperature: 67, humidity: 47, light: 83 },
  ],
  '001': [
    { date: 'T2', temperature: 68, humidity: 44, light: 85 },
    { date: 'T3', temperature: 69, humidity: 43, light: 86 },
    { date: 'T4', temperature: 68, humidity: 45, light: 84 },
    { date: 'T5', temperature: 70, humidity: 42, light: 87 },
    { date: 'T6', temperature: 71, humidity: 41, light: 89 },
    { date: 'T7', temperature: 70, humidity: 43, light: 86 },
    { date: 'CN', temperature: 69, humidity: 44, light: 85 },
  ],
  '002': [
    { date: 'T2', temperature: 62, humidity: 49, light: 72 },
    { date: 'T3', temperature: 63, humidity: 48, light: 73 },
    { date: 'T4', temperature: 62, humidity: 50, light: 71 },
    { date: 'T5', temperature: 64, humidity: 47, light: 74 },
    { date: 'T6', temperature: 65, humidity: 46, light: 76 },
    { date: 'T7', temperature: 64, humidity: 48, light: 73 },
    { date: 'CN', temperature: 63, humidity: 49, light: 72 },
  ],
  '003': [
    { date: 'T2', temperature: 72, humidity: 39, light: 87 },
    { date: 'T3', temperature: 73, humidity: 38, light: 88 },
    { date: 'T4', temperature: 72, humidity: 40, light: 86 },
    { date: 'T5', temperature: 74, humidity: 37, light: 89 },
    { date: 'T6', temperature: 75, humidity: 36, light: 91 },
    { date: 'T7', temperature: 74, humidity: 38, light: 88 },
    { date: 'CN', temperature: 73, humidity: 39, light: 87 },
  ],
  '004': [
    { date: 'T2', temperature: 57, humidity: 54, light: 77 },
    { date: 'T3', temperature: 58, humidity: 53, light: 78 },
    { date: 'T4', temperature: 57, humidity: 55, light: 76 },
    { date: 'T5', temperature: 59, humidity: 52, light: 79 },
    { date: 'T6', temperature: 60, humidity: 51, light: 81 },
    { date: 'T7', temperature: 59, humidity: 53, light: 78 },
    { date: 'CN', temperature: 58, humidity: 54, light: 77 },
  ],
  '005': [
    { date: 'T2', temperature: 70, humidity: 47, light: 91 },
    { date: 'T3', temperature: 71, humidity: 46, light: 92 },
    { date: 'T4', temperature: 70, humidity: 48, light: 90 },
    { date: 'T5', temperature: 72, humidity: 45, light: 93 },
    { date: 'T6', temperature: 73, humidity: 44, light: 94 },
    { date: 'T7', temperature: 72, humidity: 46, light: 92 },
    { date: 'CN', temperature: 71, humidity: 47, light: 91 },
  ],
  '006': [
    { date: 'T2', temperature: 64, humidity: 51, light: 67 },
    { date: 'T3', temperature: 65, humidity: 50, light: 68 },
    { date: 'T4', temperature: 64, humidity: 52, light: 66 },
    { date: 'T5', temperature: 66, humidity: 49, light: 69 },
    { date: 'T6', temperature: 67, humidity: 48, light: 71 },
    { date: 'T7', temperature: 66, humidity: 50, light: 68 },
    { date: 'CN', temperature: 65, humidity: 51, light: 67 },
  ],
  '007': [
    { date: 'T2', temperature: 74, humidity: 41, light: 89 },
    { date: 'T3', temperature: 75, humidity: 40, light: 90 },
    { date: 'T4', temperature: 74, humidity: 42, light: 88 },
    { date: 'T5', temperature: 76, humidity: 39, light: 91 },
    { date: 'T6', temperature: 77, humidity: 38, light: 93 },
    { date: 'T7', temperature: 76, humidity: 40, light: 90 },
    { date: 'CN', temperature: 75, humidity: 41, light: 89 },
  ],
  '008': [
    { date: 'T2', temperature: 60, humidity: 57, light: 74 },
    { date: 'T3', temperature: 61, humidity: 56, light: 75 },
    { date: 'T4', temperature: 60, humidity: 58, light: 73 },
    { date: 'T5', temperature: 62, humidity: 55, light: 76 },
    { date: 'T6', temperature: 63, humidity: 54, light: 78 },
    { date: 'T7', temperature: 62, humidity: 56, light: 75 },
    { date: 'CN', temperature: 61, humidity: 57, light: 74 },
  ],
};

export default function Statistics() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'hour' | 'day'>('hour');
  const [selectedMachine, setSelectedMachine] = useState('all');

  const currentData = viewMode === 'hour' 
    ? hourlyDataByMachine[selectedMachine] 
    : dailyDataByMachine[selectedMachine];
  const timeLabel = viewMode === 'hour' ? 'Giờ' : 'Ngày';

  // Calculate averages
  const avgTemp =
    currentData.reduce((sum, item) => sum + item.temperature, 0) / currentData.length;
  const avgHumidity =
    currentData.reduce((sum, item) => sum + item.humidity, 0) / currentData.length;
  const avgLight =
    currentData.reduce((sum, item) => sum + item.light, 0) / currentData.length;

  const selectedDryer = dryers.find(d => d.id === selectedMachine);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 p-6">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 px-4 py-2 mb-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="size-5" />
            <span>Quay lại</span>
          </button>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Thống Kê Hệ Thống Máy Sấy
              </h1>
              <p className="text-gray-600">
                Báo cáo và phân tích dữ liệu nhiệt độ, độ ẩm, ánh sáng
              </p>
            </div>

            <div className="flex gap-4 items-center">
              {/* Machine Selector */}
              <div className="bg-white rounded-lg shadow p-2">
                <select
                  value={selectedMachine}
                  onChange={(e) => setSelectedMachine(e.target.value)}
                  className="px-4 py-2 bg-transparent font-medium text-gray-700 border-none outline-none cursor-pointer"
                >
                  {dryers.map((dryer) => (
                    <option key={dryer.id} value={dryer.id}>
                      {dryer.name} {dryer.id !== 'all' && `- ${dryer.fruit}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2 bg-white rounded-lg shadow p-1">
                <button
                  onClick={() => setViewMode('hour')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                    viewMode === 'hour'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Clock className="size-5" />
                  Theo giờ
                </button>
                <button
                  onClick={() => setViewMode('day')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                    viewMode === 'day'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Calendar className="size-5" />
                  Theo ngày
                </button>
              </div>
            </div>
          </div>

          {/* Selected Machine Info */}
          {selectedMachine !== 'all' && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-lg border border-green-300">
              <span className="text-green-800 font-medium">
                Đang xem: {selectedDryer?.name} - {selectedDryer?.fruit}
              </span>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Nhiệt độ trung bình</p>
                <p className="text-3xl font-bold text-gray-800">{avgTemp.toFixed(1)}°C</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌡️</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Độ ẩm trung bình</p>
                <p className="text-3xl font-bold text-gray-800">{avgHumidity.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💧</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Ánh sáng trung bình</p>
                <p className="text-3xl font-bold text-gray-800">{avgLight.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">☀️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Biểu Đồ Xu Hướng Theo {timeLabel}
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={viewMode === 'hour' ? 'time' : 'date'}
                label={{ value: timeLabel, position: 'insideBottom', offset: -5 }}
              />
              <YAxis label={{ value: 'Giá trị', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#ef4444"
                strokeWidth={3}
                name="Nhiệt độ (°C)"
                dot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="humidity"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Độ ẩm (%)"
                dot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="light"
                stroke="#eab308"
                strokeWidth={3}
                name="Ánh sáng (%)"
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Biểu Đồ So Sánh Theo {timeLabel}
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={viewMode === 'hour' ? 'time' : 'date'}
                label={{ value: timeLabel, position: 'insideBottom', offset: -5 }}
              />
              <YAxis label={{ value: 'Giá trị', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="temperature" fill="#ef4444" name="Nhiệt độ (°C)" />
              <Bar dataKey="humidity" fill="#3b82f6" name="Độ ẩm (%)" />
              <Bar dataKey="light" fill="#eab308" name="Ánh sáng (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
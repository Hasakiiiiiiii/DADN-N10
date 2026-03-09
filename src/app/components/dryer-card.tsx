import { useState, useEffect } from 'react';
import { Thermometer, Droplets, Sun, DoorOpen, DoorClosed, Power, Activity, AlertCircle, Wifi } from 'lucide-react';
import { useAuth } from '../contexts/auth-context';
import { useSensor } from '../contexts/sensor-context';

interface DryerCardProps {
  id: string;
  fruitName: string;
  initialTemperature: number;
  initialHumidity: number;
  initialLight: number;
  initialDoorOpen: boolean;
  initialActive: boolean;
  tempRange?: { min: number; max: number };
  humidityRange?: { min: number; max: number };
  lightRange?: { min: number; max: number };
}

export function DryerCard({
  id,
  fruitName,
  initialTemperature,
  initialHumidity,
  initialLight,
  initialDoorOpen,
  initialActive,
  tempRange = { min: 60, max: 75 },
  humidityRange = { min: 40, max: 60 },
  lightRange = { min: 70, max: 85 },
}: DryerCardProps) {
  const { addLog } = useAuth();
  const { sensorData, connectedMachineId } = useSensor();
  const [temperature, setTemperature] = useState(initialTemperature);
  const [humidity, setHumidity] = useState(initialHumidity);
  const [light, setLight] = useState(initialLight);
  const [isDoorOpen, setIsDoorOpen] = useState(initialDoorOpen);
  const [isActive, setIsActive] = useState(initialActive);

  // Update values from sensor data if this machine is connected
  useEffect(() => {
    if (connectedMachineId === id && sensorData[id]) {
      const data = sensorData[id];
      setTemperature(data.temperature);
      setHumidity(data.humidity);
      setLight(data.light);
    }
  }, [sensorData, id, connectedMachineId]);

  // Check if this machine is receiving sensor data
  const isConnectedToSensor = connectedMachineId === id;

  // Check if values are outside safe ranges
  const isTempWarning = temperature < tempRange.min || temperature > tempRange.max;
  const isHumidityWarning = humidity < humidityRange.min || humidity > humidityRange.max;
  const isLightWarning = light < lightRange.min || light > lightRange.max;

  const calculatePosition = (value: number, min: number, max: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const handleTemperatureChange = (newValue: number) => {
    const oldValue = temperature;
    setTemperature(newValue);
    addLog(
      'Thay đổi nhiệt độ',
      id,
      fruitName,
      `Thay đổi từ ${oldValue}°C sang ${newValue}°C`
    );
  };

  const handleHumidityChange = (newValue: number) => {
    const oldValue = humidity;
    setHumidity(newValue);
    addLog(
      'Thay đổi độ ẩm',
      id,
      fruitName,
      `Thay đổi từ ${oldValue}% sang ${newValue}%`
    );
  };

  const handleLightChange = (newValue: number) => {
    const oldValue = light;
    setLight(newValue);
    addLog(
      'Thay đổi ánh sáng',
      id,
      fruitName,
      `Thay đổi từ ${oldValue}% sang ${newValue}%`
    );
  };

  const handleActiveToggle = () => {
    const newState = !isActive;
    setIsActive(newState);
    addLog(
      newState ? 'Bật máy' : 'Tắt máy',
      id,
      fruitName,
      newState ? 'Máy sấy đã được bật' : 'Máy sấy đã được tắt'
    );
  };

  const handleDoorToggle = () => {
    const newState = !isDoorOpen;
    setIsDoorOpen(newState);
    addLog(
      newState ? 'Mở cửa' : 'Đóng cửa',
      id,
      fruitName,
      newState ? 'Cửa máy sấy đã được mở' : 'Cửa máy sấy đã được đóng'
    );
  };

  return (
    <div className={`rounded-lg border-2 p-6 transition-all ${
      isActive ? 'border-green-500 bg-white shadow-lg' : 'border-gray-300 bg-gray-50'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-gray-800">{fruitName}</h3>
            {isConnectedToSensor && (
              <span className="flex items-center gap-1 px-2 py-1 bg-cyan-100 text-cyan-700 text-xs font-medium rounded-full">
                <Wifi className="size-3" />
                Yolobit
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">Máy sấy #{id}</p>
        </div>
        <button
          onClick={handleActiveToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isActive
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          <Power className="size-5" />
          {isActive ? 'Đang hoạt động' : 'Tắt'}
        </button>
      </div>

      {/* Status Display */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="size-5 text-gray-600" />
          <span className="font-medium text-gray-700">Trạng thái hiện tại</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Thermometer className="size-4 text-red-500" />
            <div>
              <p className="text-xs text-gray-500">Nhiệt độ</p>
              <p className="font-semibold text-gray-800">{temperature}°C</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="size-4 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Độ ẩm</p>
              <p className="font-semibold text-gray-800">{humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="size-4 text-yellow-500" />
            <div>
              <p className="text-xs text-gray-500">Ánh sáng</p>
              <p className="font-semibold text-gray-800">{light}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isDoorOpen ? (
              <DoorOpen className="size-4 text-orange-500" />
            ) : (
              <DoorClosed className="size-4 text-gray-600" />
            )}
            <div>
              <p className="text-xs text-gray-500">Cửa</p>
              <p className="font-semibold text-gray-800">
                {isDoorOpen ? 'Mở' : 'Đóng'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Grid */}
      <div className="space-y-6">
        {/* Temperature Control */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-700">
            <Thermometer className="size-5 text-red-500" />
            <span className="font-medium">Nhiệt độ</span>
            {isTempWarning && <AlertCircle className="size-4 text-red-600" />}
            <span className={`ml-auto text-2xl font-bold ${isTempWarning ? 'text-red-600' : 'text-red-500'}`}>
              {temperature}°C
            </span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="30"
              max="90"
              value={temperature}
              onChange={(e) => handleTemperatureChange(Number(e.target.value))}
              disabled={!isActive}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {/* Threshold marker */}
            <div 
              className="absolute top-0 w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow-lg"
              style={{ left: `calc(${calculatePosition(tempRange.min, 30, 90)}% - 6px)`, transform: 'translateY(-2px)' }}
              title={`Ngưỡng: ${tempRange.min}°C`}
            />
            <div 
              className="absolute top-0 w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow-lg"
              style={{ left: `calc(${calculatePosition(tempRange.max, 30, 90)}% - 6px)`, transform: 'translateY(-2px)' }}
              title={`Ngưỡng: ${tempRange.max}°C`}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>30°C</span>
            <span className="text-red-600 font-medium">↑ Ngưỡng: {tempRange.min}°C - {tempRange.max}°C</span>
            <span>90°C</span>
          </div>
        </div>

        {/* Humidity Control */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-700">
            <Droplets className="size-5 text-blue-500" />
            <span className="font-medium">Độ ẩm</span>
            {isHumidityWarning && <AlertCircle className="size-4 text-red-600" />}
            <span className={`ml-auto text-2xl font-bold ${isHumidityWarning ? 'text-red-600' : 'text-blue-500'}`}>
              {humidity}%
            </span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={humidity}
              onChange={(e) => handleHumidityChange(Number(e.target.value))}
              disabled={!isActive}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {/* Threshold marker */}
            <div 
              className="absolute top-0 w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow-lg"
              style={{ left: `calc(${calculatePosition(humidityRange.min, 0, 100)}% - 6px)`, transform: 'translateY(-2px)' }}
              title={`Ngưỡng: ${humidityRange.min}%`}
            />
            <div 
              className="absolute top-0 w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow-lg"
              style={{ left: `calc(${calculatePosition(humidityRange.max, 0, 100)}% - 6px)`, transform: 'translateY(-2px)' }}
              title={`Ngưỡng: ${humidityRange.max}%`}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span className="text-red-600 font-medium">↑ Ngưỡng: {humidityRange.min}% - {humidityRange.max}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Light Control */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-700">
            <Sun className="size-5 text-yellow-500" />
            <span className="font-medium">Ánh sáng</span>
            {isLightWarning && <AlertCircle className="size-4 text-red-600" />}
            <span className={`ml-auto text-2xl font-bold ${isLightWarning ? 'text-red-600' : 'text-yellow-500'}`}>
              {light}%
            </span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={light}
              onChange={(e) => handleLightChange(Number(e.target.value))}
              disabled={!isActive}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {/* Threshold marker */}
            <div 
              className="absolute top-0 w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow-lg"
              style={{ left: `calc(${calculatePosition(lightRange.min, 0, 100)}% - 6px)`, transform: 'translateY(-2px)' }}
              title={`Ngưỡng: ${lightRange.min}%`}
            />
            <div 
              className="absolute top-0 w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow-lg"
              style={{ left: `calc(${calculatePosition(lightRange.max, 0, 100)}% - 6px)`, transform: 'translateY(-2px)' }}
              title={`Ngưỡng: ${lightRange.max}%`}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span className="text-red-600 font-medium">↑ Ngưỡng: {lightRange.min}% - {lightRange.max}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Door Control */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleDoorToggle}
            disabled={!isActive}
            className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-medium text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              isDoorOpen
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-gray-700 text-white hover:bg-gray-800'
            }`}
          >
            {isDoorOpen ? (
              <>
                <DoorOpen className="size-6" />
                <span>Cửa đang mở</span>
              </>
            ) : (
              <>
                <DoorClosed className="size-6" />
                <span>Cửa đang đóng</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
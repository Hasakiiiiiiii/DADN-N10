import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Usb, Play, Square, Activity, AlertCircle, CheckCircle2, Thermometer, Droplets, Sun } from 'lucide-react';
import { useSensor } from '../contexts/sensor-context';
import { useAuth } from '../contexts/auth-context';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';

export default function YolobitConnect() {
  const navigate = useNavigate();
  const { updateSensorData, isConnected, setIsConnected, connectedMachineId, setConnectedMachineId } = useSensor();
  const { addLog } = useAuth();
  const [port, setPort] = useState<SerialPort | null>(null);
  const [reader, setReader] = useState<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const [selectedMachine, setSelectedMachine] = useState<string>('001');
  const [latestData, setLatestData] = useState<{temp: number, humidity: number, light: number} | null>(null);
  const [error, setError] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const keepReading = useRef(false);

  const machines = [
    { id: '001', name: 'Xoài' },
    { id: '002', name: 'Chuối' },
    { id: '003', name: 'Dứa' },
    { id: '004', name: 'Nhãn' },
    { id: '005', name: 'Thanh Long' },
    { id: '006', name: 'Ổi' },
    { id: '007', name: 'Mít' },
    { id: '008', name: 'Vải' },
  ];

  // Add log message
  const addLogMessage = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('vi-VN');
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)]);
  };

  // Connect to Yolobit
  const connectYolobit = async () => {
    try {
      setError('');
      addLogMessage('Đang yêu cầu kết nối với Yolobit...');
      
      // Request serial port
      const selectedPort = await navigator.serial.requestPort({
        filters: [
          { usbVendorId: 0x0403 }, // FTDI
          { usbVendorId: 0x1A86 }, // CH340
          { usbVendorId: 0x10C4 }, // CP210x
        ]
      });
      
      // Open port with common baud rate for Yolobit/ESP32
      await selectedPort.open({ baudRate: 115200 });
      
      setPort(selectedPort);
      setIsConnected(true);
      setConnectedMachineId(selectedMachine);
      addLogMessage(`✓ Kết nối thành công với máy ${machines.find(m => m.id === selectedMachine)?.name}!`);
      addLog('Kết nối Yolobit', selectedMachine, machines.find(m => m.id === selectedMachine)?.name, 'Kết nối thành công với Yolobit qua USB');
      
      // Start reading
      startReading(selectedPort);
    } catch (err: any) {
      console.error('Connection error:', err);
      if (err.name === 'NotFoundError') {
        setError('Không tìm thấy thiết bị. Vui lòng kết nối Yolobit và thử lại.');
      } else {
        setError(`Lỗi kết nối: ${err.message}`);
      }
      addLogMessage(`✗ Lỗi kết nối: ${err.message}`);
    }
  };

  // Start reading data from serial port
  const startReading = async (serialPort: SerialPort) => {
    keepReading.current = true;
    
    try {
      const textDecoder = new TextDecoderStream();
      serialPort.readable?.pipeTo(textDecoder.writable);
      const streamReader = textDecoder.readable.getReader();
      setReader(streamReader);
      
      let buffer = '';
      
      while (keepReading.current) {
        const { value, done } = await streamReader.read();
        if (done) break;
        
        buffer += value;
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine) {
            parseData(trimmedLine);
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'NetworkError') {
        console.error('Reading error:', err);
        addLogMessage(`✗ Lỗi đọc dữ liệu: ${err.message}`);
      }
    }
  };

  // Parse incoming data
  const parseData = (data: string) => {
    try {
      // Try JSON format first: {"temp":65,"humidity":45,"light":80}
      if (data.startsWith('{')) {
        const parsed = JSON.parse(data);
        if (parsed.temp !== undefined && parsed.humidity !== undefined && parsed.light !== undefined) {
          updateData(parsed.temp, parsed.humidity, parsed.light);
          return;
        }
      }
      
      // Try CSV format: temp:65,humidity:45,light:80
      if (data.includes(':') && data.includes(',')) {
        const parts = data.split(',');
        const values: any = {};
        
        parts.forEach(part => {
          const [key, value] = part.split(':');
          if (key && value) {
            values[key.trim().toLowerCase()] = parseFloat(value.trim());
          }
        });
        
        if (values.temp !== undefined && values.humidity !== undefined && values.light !== undefined) {
          updateData(values.temp, values.humidity, values.light);
          return;
        }
      }
      
      // Try space-separated format: 65 45 80
      const numbers = data.split(/\s+/).map(n => parseFloat(n)).filter(n => !isNaN(n));
      if (numbers.length === 3) {
        updateData(numbers[0], numbers[1], numbers[2]);
        return;
      }
      
      // If no format matched, just log it
      addLogMessage(`Dữ liệu: ${data}`);
      
    } catch (err) {
      console.error('Parse error:', err);
    }
  };

  // Update sensor data
  const updateData = (temp: number, humidity: number, light: number) => {
    // Validate ranges
    const validTemp = Math.max(30, Math.min(90, temp));
    const validHumidity = Math.max(0, Math.min(100, humidity));
    const validLight = Math.max(0, Math.min(100, light));
    
    setLatestData({
      temp: validTemp,
      humidity: validHumidity,
      light: validLight
    });
    
    updateSensorData(connectedMachineId || selectedMachine, {
      temperature: validTemp,
      humidity: validHumidity,
      light: validLight,
      timestamp: new Date()
    });
    
    addLogMessage(`📊 Nhiệt độ: ${validTemp}°C | Độ ẩm: ${validHumidity}% | Ánh sáng: ${validLight}%`);
  };

  // Disconnect from Yolobit
  const disconnectYolobit = async () => {
    try {
      keepReading.current = false;
      
      if (reader) {
        await reader.cancel();
        reader.releaseLock();
        setReader(null);
      }
      
      if (port) {
        await port.close();
        setPort(null);
      }
      
      setIsConnected(false);
      addLogMessage('✓ Ngắt kết nối thành công');
      addLog('Ngắt kết nối Yolobit', connectedMachineId || undefined, machines.find(m => m.id === connectedMachineId)?.name, 'Ngắt kết nối với Yolobit');
      setConnectedMachineId(null);
      
    } catch (err: any) {
      console.error('Disconnect error:', err);
      addLogMessage(`✗ Lỗi ngắt kết nối: ${err.message}`);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isConnected) {
        disconnectYolobit();
      }
    };
  }, []);

  // Check if Web Serial API is supported
  const isSerialSupported = 'serial' in navigator;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="size-5" />
            <span>Quay lại trang chủ</span>
          </button>
          
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
            <span className="text-sm font-medium text-gray-700">
              {isConnected ? 'Đã kết nối' : 'Chưa kết nối'}
            </span>
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-4">
            <Usb className="size-10 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Kết Nối Yolobit
          </h1>
          <p className="text-gray-600">
            Kết nối với mạch Yolobit để đọc dữ liệu cảm biến thời gian thực
          </p>
        </div>

        {/* Browser Support Warning */}
        {!isSerialSupported && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-800 font-medium">Trình duyệt không hỗ trợ</p>
              <p className="text-yellow-700 text-sm">
                Web Serial API chỉ hoạt động trên Chrome, Edge hoặc Opera. Vui lòng sử dụng một trong các trình duyệt này.
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Control Panel */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Play className="size-6 text-purple-600" />
              Bảng Điều Khiển
            </h2>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="size-5 text-red-600 flex-shrink-0" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Machine Selection */}
            <div className="mb-6">
              <Label className="text-gray-700 mb-2 block">Chọn máy sấy</Label>
              <select
                value={selectedMachine}
                onChange={(e) => setSelectedMachine(e.target.value)}
                disabled={isConnected}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {machines.map(machine => (
                  <option key={machine.id} value={machine.id}>
                    Máy {machine.id} - {machine.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Connection Buttons */}
            <div className="space-y-3">
              {!isConnected ? (
                <Button
                  onClick={connectYolobit}
                  disabled={!isSerialSupported}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6"
                >
                  <Play className="size-5 mr-2" />
                  Kết Nối Yolobit
                </Button>
              ) : (
                <Button
                  onClick={disconnectYolobit}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-6"
                >
                  <Square className="size-5 mr-2" />
                  Ngắt Kết Nối
                </Button>
              )}
            </div>

            {/* Latest Data Display */}
            {latestData && isConnected && (
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Activity className="size-5 text-purple-600" />
                  Dữ Liệu Mới Nhất
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <Thermometer className="size-6 text-red-500 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-gray-800">{latestData.temp}°C</div>
                    <div className="text-xs text-gray-600">Nhiệt độ</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <Droplets className="size-6 text-blue-500 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-gray-800">{latestData.humidity}%</div>
                    <div className="text-xs text-gray-600">Độ ẩm</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <Sun className="size-6 text-yellow-500 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-gray-800">{latestData.light}%</div>
                    <div className="text-xs text-gray-600">Ánh sáng</div>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Hướng dẫn:</h3>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Kết nối Yolobit với máy tính qua USB</li>
                <li>Chọn máy sấy muốn gán dữ liệu</li>
                <li>Nhấn nút "Kết Nối Yolobit"</li>
                <li>Chọn cổng COM tương ứng</li>
                <li>Dữ liệu sẽ tự động cập nhật</li>
              </ol>
            </div>

            {/* Data Format */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Format dữ liệu từ Yolobit:</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-mono bg-white px-2 py-1 rounded">{"temp:65,humidity:45,light:80"}</p>
                <p className="text-xs text-gray-600">hoặc</p>
                <p className="font-mono bg-white px-2 py-1 rounded">{'{"temp":65,"humidity":45,"light":80}'}</p>
                <p className="text-xs text-gray-600">hoặc</p>
                <p className="font-mono bg-white px-2 py-1 rounded">{"65 45 80"}</p>
              </div>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Activity className="size-6 text-blue-600" />
              Nhật Ký Hoạt Động
            </h2>

            <div className="bg-gray-900 rounded-lg p-4 h-[600px] overflow-y-auto font-mono text-sm">
              {logs.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Chưa có hoạt động nào...
                </p>
              ) : (
                <div className="space-y-1">
                  {logs.map((log, index) => (
                    <div key={index} className={`${
                      log.includes('✓') ? 'text-green-400' :
                      log.includes('✗') ? 'text-red-400' :
                      log.includes('📊') ? 'text-blue-400' :
                      'text-gray-300'
                    }`}>
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

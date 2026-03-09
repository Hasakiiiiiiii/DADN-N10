import { DryerCard } from "@/app/components/dryer-card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function Control() {
  const navigate = useNavigate();

  const dryers = [
    {
      id: "001",
      fruitName: "Xoài",
      initialTemperature: 65,
      initialHumidity: 45,
      initialLight: 80,
      initialDoorOpen: false,
      initialActive: true,
      tempRange: { min: 60, max: 75 },
      humidityRange: { min: 40, max: 60 },
      lightRange: { min: 75, max: 90 },
    },
    {
      id: "002",
      fruitName: "Chuối",
      initialTemperature: 60,
      initialHumidity: 50,
      initialLight: 70,
      initialDoorOpen: false,
      initialActive: true,
      tempRange: { min: 55, max: 70 },
      humidityRange: { min: 45, max: 65 },
      lightRange: { min: 65, max: 80 },
    },
    {
      id: "003",
      fruitName: "Dứa",
      initialTemperature: 70,
      initialHumidity: 40,
      initialLight: 85,
      initialDoorOpen: false,
      initialActive: false,
      tempRange: { min: 65, max: 80 },
      humidityRange: { min: 35, max: 55 },
      lightRange: { min: 80, max: 95 },
    },
    {
      id: "004",
      fruitName: "Nhãn",
      initialTemperature: 55,
      initialHumidity: 55,
      initialLight: 75,
      initialDoorOpen: true,
      initialActive: true,
      tempRange: { min: 50, max: 68 },
      humidityRange: { min: 48, max: 62 },
      lightRange: { min: 70, max: 85 },
    },
    {
      id: "005",
      fruitName: "Thanh Long",
      initialTemperature: 68,
      initialHumidity: 48,
      initialLight: 90,
      initialDoorOpen: false,
      initialActive: true,
      tempRange: { min: 62, max: 75 },
      humidityRange: { min: 42, max: 58 },
      lightRange: { min: 85, max: 95 },
    },
    {
      id: "006",
      fruitName: "Ổi",
      initialTemperature: 62,
      initialHumidity: 52,
      initialLight: 65,
      initialDoorOpen: false,
      initialActive: false,
      tempRange: { min: 58, max: 72 },
      humidityRange: { min: 45, max: 60 },
      lightRange: { min: 60, max: 78 },
    },
    {
      id: "007",
      fruitName: "Mít",
      initialTemperature: 72,
      initialHumidity: 42,
      initialLight: 88,
      initialDoorOpen: false,
      initialActive: true,
      tempRange: { min: 68, max: 82 },
      humidityRange: { min: 38, max: 55 },
      lightRange: { min: 82, max: 95 },
    },
    {
      id: "008",
      fruitName: "Vải",
      initialTemperature: 58,
      initialHumidity: 58,
      initialLight: 72,
      initialDoorOpen: false,
      initialActive: true,
      tempRange: { min: 52, max: 68 },
      humidityRange: { min: 50, max: 70 },
      lightRange: { min: 68, max: 85 },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 p-6">
      {/* Header */}
      <div className="max-w-[1800px] mx-auto mb-6">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 px-4 py-2 mb-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="size-5" />
          <span>Quay lại</span>
        </button>

        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Hệ Thống Điều Khiển Máy Sấy Trái Cây
        </h1>
        <p className="text-gray-600">
          Quản lý và điều khiển nhiệt độ, độ ẩm, ánh sáng cho
          các máy sấy
        </p>
        <div className="mt-4 flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-700">
              Đang hoạt động:{" "}
              {dryers.filter((d) => d.initialActive).length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <span className="text-gray-700">
              Đã tắt:{" "}
              {dryers.filter((d) => !d.initialActive).length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span className="text-gray-700">
              Chấm đỏ = Khoảng ngưỡng an toàn
            </span>
          </div>
        </div>
      </div>

      {/* Dryers Grid */}
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {dryers.map((dryer) => (
          <DryerCard key={dryer.id} {...dryer} />
        ))}
      </div>
    </div>
  );
}
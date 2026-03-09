import { createContext, useContext, useState, ReactNode } from 'react';

export interface SensorData {
  temperature: number;
  humidity: number;
  light: number;
  timestamp: Date;
}

export interface MachineData {
  [machineId: string]: SensorData;
}

interface SensorContextType {
  sensorData: MachineData;
  updateSensorData: (machineId: string, data: SensorData) => void;
  clearSensorData: (machineId: string) => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  connectedMachineId: string | null;
  setConnectedMachineId: (machineId: string | null) => void;
}

const SensorContext = createContext<SensorContextType | undefined>(undefined);

export function SensorProvider({ children }: { children: ReactNode }) {
  const [sensorData, setSensorData] = useState<MachineData>({});
  const [isConnected, setIsConnected] = useState(false);
  const [connectedMachineId, setConnectedMachineId] = useState<string | null>(null);

  const updateSensorData = (machineId: string, data: SensorData) => {
    setSensorData(prev => ({
      ...prev,
      [machineId]: data
    }));
  };

  const clearSensorData = (machineId: string) => {
    setSensorData(prev => {
      const newData = { ...prev };
      delete newData[machineId];
      return newData;
    });
  };

  return (
    <SensorContext.Provider 
      value={{ 
        sensorData, 
        updateSensorData, 
        clearSensorData, 
        isConnected, 
        setIsConnected,
        connectedMachineId,
        setConnectedMachineId
      }}
    >
      {children}
    </SensorContext.Provider>
  );
}

export function useSensor() {
  const context = useContext(SensorContext);
  if (context === undefined) {
    throw new Error('useSensor must be used within a SensorProvider');
  }
  return context;
}

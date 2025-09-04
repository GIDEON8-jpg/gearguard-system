import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Driver, Vehicle, MaintenanceRecord, mockDrivers, mockVehicles, mockMaintenanceRecords } from '@/lib/mockData';

interface DataContextType {
  // Drivers
  drivers: Driver[];
  addDriver: (driver: Driver) => void;
  updateDriver: (id: string, driver: Partial<Driver>) => void;
  deleteDriver: (id: string) => void;
  
  // Vehicles
  vehicles: Vehicle[];
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  
  // Maintenance
  maintenanceRecords: MaintenanceRecord[];
  addMaintenanceRecord: (record: MaintenanceRecord) => void;
  updateMaintenanceRecord: (id: string, record: Partial<MaintenanceRecord>) => void;
  deleteMaintenanceRecord: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  // Initialize with mock data and persist in localStorage
  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const saved = localStorage.getItem('fleetguard-drivers');
    return saved ? JSON.parse(saved) : mockDrivers;
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('fleetguard-vehicles');
    return saved ? JSON.parse(saved) : mockVehicles;
  });

  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(() => {
    const saved = localStorage.getItem('fleetguard-maintenance');
    return saved ? JSON.parse(saved) : mockMaintenanceRecords;
  });

  // Persist to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('fleetguard-drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('fleetguard-vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('fleetguard-maintenance', JSON.stringify(maintenanceRecords));
  }, [maintenanceRecords]);

  // Driver operations
  const addDriver = (driver: Driver) => {
    setDrivers(prev => [...prev, driver]);
  };

  const updateDriver = (id: string, updatedDriver: Partial<Driver>) => {
    setDrivers(prev => prev.map(driver => 
      driver.id === id ? { ...driver, ...updatedDriver } : driver
    ));
  };

  const deleteDriver = (id: string) => {
    setDrivers(prev => prev.filter(driver => driver.id !== id));
    // Also remove driver assignments from vehicles
    setVehicles(prev => prev.map(vehicle => 
      vehicle.driver?.id === id ? { ...vehicle, driver: undefined } : vehicle
    ));
  };

  // Vehicle operations
  const addVehicle = (vehicle: Vehicle) => {
    setVehicles(prev => [...prev, vehicle]);
  };

  const updateVehicle = (id: string, updatedVehicle: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(vehicle => 
      vehicle.id === id ? { ...vehicle, ...updatedVehicle } : vehicle
    ));
  };

  const deleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
    // Also remove maintenance records for this vehicle
    setMaintenanceRecords(prev => prev.filter(record => record.vehicleId !== id));
  };

  // Maintenance operations
  const addMaintenanceRecord = (record: MaintenanceRecord) => {
    setMaintenanceRecords(prev => [...prev, record]);
  };

  const updateMaintenanceRecord = (id: string, updatedRecord: Partial<MaintenanceRecord>) => {
    setMaintenanceRecords(prev => prev.map(record => 
      record.id === id ? { ...record, ...updatedRecord } : record
    ));
  };

  const deleteMaintenanceRecord = (id: string) => {
    setMaintenanceRecords(prev => prev.filter(record => record.id !== id));
  };

  return (
    <DataContext.Provider value={{
      drivers,
      addDriver,
      updateDriver,
      deleteDriver,
      vehicles,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      maintenanceRecords,
      addMaintenanceRecord,
      updateMaintenanceRecord,
      deleteMaintenanceRecord
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
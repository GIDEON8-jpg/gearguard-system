import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

// Define interfaces to match database schema
export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string | null;
  email: string | null;
  status: 'available' | 'busy' | 'off-duty';
  assignedVehicle: string | null;
}

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  make: string;
  model: string;
  year: number;
  status: 'available' | 'in-use' | 'maintenance' | 'out-of-service';
  location: string | null;
  driver: string | null;
  fuelLevel: number | null;
  mileage: number | null;
  lastMaintenance: string | null;
  nextMaintenance: string | null;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: string;
  description: string | null;
  cost: number | null;
  date: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  nextDue: string | null;
}

interface DataContextType {
  drivers: Driver[];
  vehicles: Vehicle[];
  maintenanceRecords: MaintenanceRecord[];
  
  // Driver operations
  addDriver: (driver: Omit<Driver, 'id'>) => Promise<void>;
  updateDriver: (id: string, driver: Partial<Driver>) => Promise<void>;
  deleteDriver: (id: string) => Promise<void>;
  
  // Vehicle operations
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Promise<void>;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  
  // Maintenance operations
  addMaintenanceRecord: (record: Omit<MaintenanceRecord, 'id'>) => Promise<void>;
  updateMaintenanceRecord: (id: string, record: Partial<MaintenanceRecord>) => Promise<void>;
  deleteMaintenanceRecord: (id: string) => Promise<void>;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadAllData();
    } else {
      // Clear data when user logs out
      setDrivers([]);
      setVehicles([]);
      setMaintenanceRecords([]);
    }
  }, [isAuthenticated, user]);

  const loadAllData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        loadDrivers(),
        loadVehicles(),
        loadMaintenanceRecords()
      ]);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDrivers = async () => {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('user_id', user?.id);
    
    if (error) throw error;
    
    const formattedDrivers: Driver[] = data?.map(driver => ({
      id: driver.id,
      name: driver.name,
      licenseNumber: driver.license_number,
      phone: driver.phone,
      email: driver.email,
      status: (driver.status === 'available' || driver.status === 'busy' || driver.status === 'off-duty') 
        ? driver.status as 'available' | 'busy' | 'off-duty' 
        : 'available',
      assignedVehicle: driver.assigned_vehicle
    })) || [];
    
    setDrivers(formattedDrivers);
  };

  const loadVehicles = async () => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('user_id', user?.id);
    
    if (error) throw error;
    
    const formattedVehicles: Vehicle[] = data?.map(vehicle => ({
      id: vehicle.id,
      vehicleNumber: vehicle.vehicle_number,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      status: (vehicle.status === 'available' || vehicle.status === 'in-use' || vehicle.status === 'maintenance' || vehicle.status === 'out-of-service') 
        ? vehicle.status as 'available' | 'in-use' | 'maintenance' | 'out-of-service' 
        : 'available',
      location: vehicle.location,
      driver: vehicle.driver,
      fuelLevel: vehicle.fuel_level,
      mileage: vehicle.mileage,
      lastMaintenance: vehicle.last_maintenance,
      nextMaintenance: vehicle.next_maintenance
    })) || [];
    
    setVehicles(formattedVehicles);
  };

  const loadMaintenanceRecords = async () => {
    const { data, error } = await supabase
      .from('maintenance_records')
      .select('*')
      .eq('user_id', user?.id);
    
    if (error) throw error;
    
    const formattedRecords: MaintenanceRecord[] = data?.map(record => ({
      id: record.id,
      vehicleId: record.vehicle_id,
      type: record.type,
      description: record.description,
      cost: record.cost,
      date: record.date,
      status: (record.status === 'pending' || record.status === 'in-progress' || record.status === 'completed' || record.status === 'cancelled') 
        ? record.status as 'pending' | 'in-progress' | 'completed' | 'cancelled' 
        : 'pending',
      nextDue: record.next_due
    })) || [];
    
    setMaintenanceRecords(formattedRecords);
  };

  // Driver operations
  const addDriver = async (driverData: Omit<Driver, 'id'>) => {
    const { data, error } = await supabase
      .from('drivers')
      .insert({
        user_id: user?.id,
        name: driverData.name,
        license_number: driverData.licenseNumber,
        phone: driverData.phone,
        email: driverData.email,
        status: driverData.status,
        assigned_vehicle: driverData.assignedVehicle
      })
      .select()
      .single();
    
    if (error) throw error;
    
    const newDriver: Driver = {
      id: data.id,
      name: data.name,
      licenseNumber: data.license_number,
      phone: data.phone,
      email: data.email,
      status: data.status,
      assignedVehicle: data.assigned_vehicle
    };
    
    setDrivers(prev => [...prev, newDriver]);
  };

  const updateDriver = async (id: string, driverData: Partial<Driver>) => {
    const updateData: any = {};
    if (driverData.name) updateData.name = driverData.name;
    if (driverData.licenseNumber) updateData.license_number = driverData.licenseNumber;
    if (driverData.phone !== undefined) updateData.phone = driverData.phone;
    if (driverData.email !== undefined) updateData.email = driverData.email;
    if (driverData.status) updateData.status = driverData.status;
    if (driverData.assignedVehicle !== undefined) updateData.assigned_vehicle = driverData.assignedVehicle;
    
    const { error } = await supabase
      .from('drivers')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user?.id);
    
    if (error) throw error;
    
    setDrivers(prev => prev.map(driver => 
      driver.id === id ? { ...driver, ...driverData } : driver
    ));
  };

  const deleteDriver = async (id: string) => {
    const { error } = await supabase
      .from('drivers')
      .delete()
      .eq('id', id)
      .eq('user_id', user?.id);
    
    if (error) throw error;
    
    setDrivers(prev => prev.filter(driver => driver.id !== id));
  };

  // Vehicle operations
  const addVehicle = async (vehicleData: Omit<Vehicle, 'id'>) => {
    const { data, error } = await supabase
      .from('vehicles')
      .insert({
        user_id: user?.id,
        vehicle_number: vehicleData.vehicleNumber,
        make: vehicleData.make,
        model: vehicleData.model,
        year: vehicleData.year,
        status: vehicleData.status,
        location: vehicleData.location,
        driver: vehicleData.driver,
        fuel_level: vehicleData.fuelLevel,
        mileage: vehicleData.mileage,
        last_maintenance: vehicleData.lastMaintenance,
        next_maintenance: vehicleData.nextMaintenance
      })
      .select()
      .single();
    
    if (error) throw error;
    
    const newVehicle: Vehicle = {
      id: data.id,
      vehicleNumber: data.vehicle_number,
      make: data.make,
      model: data.model,
      year: data.year,
      status: data.status,
      location: data.location,
      driver: data.driver,
      fuelLevel: data.fuel_level,
      mileage: data.mileage,
      lastMaintenance: data.last_maintenance,
      nextMaintenance: data.next_maintenance
    };
    
    setVehicles(prev => [...prev, newVehicle]);
  };

  const updateVehicle = async (id: string, vehicleData: Partial<Vehicle>) => {
    const updateData: any = {};
    if (vehicleData.vehicleNumber) updateData.vehicle_number = vehicleData.vehicleNumber;
    if (vehicleData.make) updateData.make = vehicleData.make;
    if (vehicleData.model) updateData.model = vehicleData.model;
    if (vehicleData.year) updateData.year = vehicleData.year;
    if (vehicleData.status) updateData.status = vehicleData.status;
    if (vehicleData.location !== undefined) updateData.location = vehicleData.location;
    if (vehicleData.driver !== undefined) updateData.driver = vehicleData.driver;
    if (vehicleData.fuelLevel !== undefined) updateData.fuel_level = vehicleData.fuelLevel;
    if (vehicleData.mileage !== undefined) updateData.mileage = vehicleData.mileage;
    if (vehicleData.lastMaintenance !== undefined) updateData.last_maintenance = vehicleData.lastMaintenance;
    if (vehicleData.nextMaintenance !== undefined) updateData.next_maintenance = vehicleData.nextMaintenance;
    
    const { error } = await supabase
      .from('vehicles')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user?.id);
    
    if (error) throw error;
    
    setVehicles(prev => prev.map(vehicle => 
      vehicle.id === id ? { ...vehicle, ...vehicleData } : vehicle
    ));
  };

  const deleteVehicle = async (id: string) => {
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id)
      .eq('user_id', user?.id);
    
    if (error) throw error;
    
    setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
  };

  // Maintenance operations
  const addMaintenanceRecord = async (recordData: Omit<MaintenanceRecord, 'id'>) => {
    const { data, error } = await supabase
      .from('maintenance_records')
      .insert({
        user_id: user?.id,
        vehicle_id: recordData.vehicleId,
        type: recordData.type,
        description: recordData.description,
        cost: recordData.cost,
        date: recordData.date,
        status: recordData.status,
        next_due: recordData.nextDue
      })
      .select()
      .single();
    
    if (error) throw error;
    
    const newRecord: MaintenanceRecord = {
      id: data.id,
      vehicleId: data.vehicle_id,
      type: data.type,
      description: data.description,
      cost: data.cost,
      date: data.date,
      status: data.status,
      nextDue: data.next_due
    };
    
    setMaintenanceRecords(prev => [...prev, newRecord]);
  };

  const updateMaintenanceRecord = async (id: string, recordData: Partial<MaintenanceRecord>) => {
    const updateData: any = {};
    if (recordData.vehicleId) updateData.vehicle_id = recordData.vehicleId;
    if (recordData.type) updateData.type = recordData.type;
    if (recordData.description !== undefined) updateData.description = recordData.description;
    if (recordData.cost !== undefined) updateData.cost = recordData.cost;
    if (recordData.date) updateData.date = recordData.date;
    if (recordData.status) updateData.status = recordData.status;
    if (recordData.nextDue !== undefined) updateData.next_due = recordData.nextDue;
    
    const { error } = await supabase
      .from('maintenance_records')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user?.id);
    
    if (error) throw error;
    
    setMaintenanceRecords(prev => prev.map(record => 
      record.id === id ? { ...record, ...recordData } : record
    ));
  };

  const deleteMaintenanceRecord = async (id: string) => {
    const { error } = await supabase
      .from('maintenance_records')
      .delete()
      .eq('id', id)
      .eq('user_id', user?.id);
    
    if (error) throw error;
    
    setMaintenanceRecords(prev => prev.filter(record => record.id !== id));
  };

  const value: DataContextType = {
    drivers,
    vehicles,
    maintenanceRecords,
    addDriver,
    updateDriver,
    deleteDriver,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    addMaintenanceRecord,
    updateMaintenanceRecord,
    deleteMaintenanceRecord,
    isLoading,
    error
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
export interface Vehicle {
  id: string;
  vehicleNumber: string;
  make: string;
  model: string;
  year: number;
  status: 'online' | 'maintenance' | 'offline';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  driver?: {
    id: string;
    name: string;
  };
  fuelLevel: number;
  mileage: number;
  lastMaintenance: string;
  nextMaintenance: string;
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  assignedVehicle?: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: 'scheduled' | 'repair' | 'inspection';
  description: string;
  cost: number;
  date: string;
  status: 'completed' | 'pending' | 'overdue';
  nextDue?: string;
}

export const mockVehicles: Vehicle[] = [
  {
    id: "1",
    vehicleNumber: "FL-001",
    make: "Toyota",
    model: "Camry",
    year: 2022,
    status: "online",
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: "New York, NY"
    },
    driver: {
      id: "1",
      name: "John Smith"
    },
    fuelLevel: 85,
    mileage: 25000,
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-04-15"
  },
  {
    id: "2",
    vehicleNumber: "FL-002",
    make: "Ford",
    model: "Transit",
    year: 2021,
    status: "maintenance",
    location: {
      lat: 40.7589,
      lng: -73.9851,
      address: "Manhattan, NY"
    },
    fuelLevel: 45,
    mileage: 45000,
    lastMaintenance: "2024-02-20",
    nextMaintenance: "2024-05-20"
  },
  {
    id: "3",
    vehicleNumber: "FL-003",
    make: "Honda",
    model: "Civic",
    year: 2023,
    status: "offline",
    location: {
      lat: 40.6782,
      lng: -73.9442,
      address: "Brooklyn, NY"
    },
    fuelLevel: 20,
    mileage: 15000,
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-04-10"
  },
  {
    id: "4",
    vehicleNumber: "FL-004",
    make: "Chevrolet",
    model: "Malibu",
    year: 2022,
    status: "online",
    location: {
      lat: 40.7505,
      lng: -73.9934,
      address: "Times Square, NY"
    },
    driver: {
      id: "2",
      name: "Sarah Johnson"
    },
    fuelLevel: 70,
    mileage: 32000,
    lastMaintenance: "2024-02-01",
    nextMaintenance: "2024-05-01"
  }
];

export const mockDrivers: Driver[] = [
  {
    id: "1",
    name: "John Smith",
    licenseNumber: "DL123456789",
    phone: "+1-555-0101",
    email: "john.smith@company.com",
    status: "active",
    assignedVehicle: "1"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    licenseNumber: "DL987654321",
    phone: "+1-555-0102",
    email: "sarah.johnson@company.com",
    status: "active",
    assignedVehicle: "4"
  },
  {
    id: "3",
    name: "Mike Davis",
    licenseNumber: "DL456789123",
    phone: "+1-555-0103",
    email: "mike.davis@company.com",
    status: "inactive"
  }
];

export const mockMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: "1",
    vehicleId: "1",
    type: "scheduled",
    description: "Oil Change & Filter Replacement",
    cost: 85,
    date: "2024-01-15",
    status: "completed",
    nextDue: "2024-04-15"
  },
  {
    id: "2",
    vehicleId: "2",
    type: "repair",
    description: "Brake Pad Replacement",
    cost: 320,
    date: "2024-02-20",
    status: "pending"
  },
  {
    id: "3",
    vehicleId: "3",
    type: "inspection",
    description: "Annual Safety Inspection",
    cost: 150,
    date: "2024-01-10",
    status: "overdue",
    nextDue: "2024-04-10"
  }
];
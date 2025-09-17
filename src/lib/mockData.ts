export interface Vehicle {
  id: string;
  vehicleNumber: string;
  make: string;
  model: string;
  year: number;
  status: 'available' | 'in-use' | 'maintenance' | 'out-of-service';
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
  status: 'available' | 'busy' | 'off-duty';
  assignedVehicle?: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: string;
  description: string;
  cost: number;
  date: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  nextDue?: string;
}

export const mockVehicles: Vehicle[] = [
  {
    id: "1",
    vehicleNumber: "ABD 1110",
    make: "Toyota",
    model: "Camry",
    year: 2022,
    status: "available",
    location: {
      lat: -17.8252,
      lng: 31.0335,
      address: "Harare CBD, Zimbabwe"
    },
    driver: {
      id: "1",
      name: "Gideon Zimano"
    },
    fuelLevel: 85,
    mileage: 25000,
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-04-15"
  },
  {
    id: "2",
    vehicleNumber: "ABC 2345",
    make: "Ford",
    model: "Ranger",
    year: 2021,
    status: "maintenance",
    location: {
      lat: -17.8292,
      lng: 31.0522,
      address: "Avondale, Harare"
    },
    fuelLevel: 45,
    mileage: 45000,
    lastMaintenance: "2024-02-20",
    nextMaintenance: "2024-05-20"
  },
  {
    id: "3",
    vehicleNumber: "ACD 5678",
    make: "Honda",
    model: "Fit",
    year: 2023,
    status: "out-of-service",
    location: {
      lat: -17.8145,
      lng: 31.0067,
      address: "Borrowdale, Harare"
    },
    fuelLevel: 20,
    mileage: 15000,
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-04-10"
  },
  {
    id: "4",
    vehicleNumber: "ADE 1234",
    make: "Nissan",
    model: "Navara",
    year: 2022,
    status: "in-use",
    location: {
      lat: -17.8739,
      lng: 31.0297,
      address: "Warren Park, Harare"
    },
    driver: {
      id: "2",
      name: "Hope Chuma"
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
    name: "Gideon Zimano",
    licenseNumber: "ZW123456789",
    phone: "+263-77-123-4567",
    email: "gideon.zimano@company.co.zw",
    status: "available",
    assignedVehicle: "1"
  },
  {
    id: "2", 
    name: "Hope Chuma",
    licenseNumber: "ZW987654321",
    phone: "+263-77-234-5678", 
    email: "hope.chuma@company.co.zw",
    status: "busy",
    assignedVehicle: "4"
  },
  {
    id: "3",
    name: "Tino Chandengenda", 
    licenseNumber: "ZW456789123",
    phone: "+263-77-345-6789",
    email: "tino.chandengenda@company.co.zw",
    status: "available"
  },
  {
    id: "4",
    name: "Leeroy Sibanda",
    licenseNumber: "ZW789123456", 
    phone: "+263-77-456-7890",
    email: "leeroy.sibanda@company.co.zw",
    status: "off-duty"
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
    status: "cancelled",
    nextDue: "2024-04-10"
  },
  {
    id: "4",
    vehicleId: "4", 
    type: "scheduled",
    description: "Transmission Service & Fluid Change",
    cost: 220,
    date: "2024-03-01",
    status: "completed",
    nextDue: "2024-06-01"
  }
];
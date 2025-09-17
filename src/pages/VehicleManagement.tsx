import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Plus, Search, Edit, Trash2, Car, MapPin, Fuel } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useData, Vehicle } from "@/contexts/DataContext";

interface VehicleFormData {
  vehicleNumber: string;
  make: string;
  model: string;
  year: number;
  status: "available" | "in-use" | "maintenance" | "out-of-service";
  fuelLevel: number;
  mileage: number;
  location: string;
  driver: string | null;
  lastMaintenance: string | null;
  nextMaintenance: string | null;
}

const zimbabweanLocations = [
  "Harare CBD, Zimbabwe",
  "Avondale, Harare", 
  "Borrowdale, Harare",
  "Warren Park, Harare",
  "Mount Pleasant, Harare",
  "Highlands, Harare",
  "Eastlea, Harare",
  "Chitungwiza, Zimbabwe",
  "Bulawayo CBD, Zimbabwe",
  "Gweru, Zimbabwe"
];

export default function VehicleManagement() {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const { toast } = useToast();
  
  const form = useForm<VehicleFormData>();
  
  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${vehicle.make} ${vehicle.model}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data: VehicleFormData) => {
    if (editingVehicle) {
      updateVehicle(editingVehicle.id, data);
      toast({ title: "Vehicle updated successfully" });
    } else {
      addVehicle(data);
      toast({ title: "Vehicle added successfully" });
    }
    
    setIsDialogOpen(false);
    setEditingVehicle(null);
    form.reset();
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    form.reset({
      vehicleNumber: vehicle.vehicleNumber,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      status: vehicle.status,
      fuelLevel: vehicle.fuelLevel || 100,
      mileage: vehicle.mileage || 0,
      location: vehicle.location || zimbabweanLocations[0]
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (vehicleId: string) => {
    deleteVehicle(vehicleId);
    toast({ title: "Vehicle deleted successfully", variant: "destructive" });
  };

  const handleAddNew = () => {
    setEditingVehicle(null);
    form.reset({
      vehicleNumber: "",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      status: "available",
      fuelLevel: 100,
      mileage: 0,
      location: zimbabweanLocations[0]
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vehicle Management</h1>
          <p className="text-muted-foreground">Add, edit, and manage your fleet vehicles</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="w-4 h-4" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
              </DialogTitle>
              <DialogDescription>
                {editingVehicle ? "Update vehicle information" : "Add a new vehicle to your fleet"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="vehicleNumber"
                  rules={{ required: "Vehicle number is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Number</FormLabel>
                      <FormControl>
                        <Input placeholder="ABD 1234" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="make"
                    rules={{ required: "Make is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Make</FormLabel>
                        <FormControl>
                          <Input placeholder="Toyota" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="model"
                    rules={{ required: "Model is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                          <Input placeholder="Camry" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="year"
                    rules={{ 
                      required: "Year is required",
                      min: { value: 1900, message: "Invalid year" },
                      max: { value: new Date().getFullYear() + 1, message: "Future year not allowed" }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="2023" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="in-use">In Use</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="out-of-service">Out of Service</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="location"
                  rules={{ required: "Location is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Location</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {zimbabweanLocations.map(location => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fuelLevel"
                    rules={{ 
                      required: "Fuel level is required",
                      min: { value: 0, message: "Minimum 0%" },
                      max: { value: 100, message: "Maximum 100%" }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fuel Level (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="85" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="mileage"
                    rules={{ 
                      required: "Mileage is required",
                      min: { value: 0, message: "Cannot be negative" }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mileage (km)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="25000" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingVehicle ? "Update Vehicle" : "Add Vehicle"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search vehicles by number or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  {vehicle.vehicleNumber}
                </CardTitle>
                <StatusBadge status={vehicle.status} />
              </div>
              <p className="text-sm text-muted-foreground">
                {vehicle.make} {vehicle.model} ({vehicle.year})
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-accent" />
                  <div>
                    <p className="text-sm font-medium">{vehicle.fuelLevel}%</p>
                    <p className="text-xs text-muted-foreground">Fuel</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{(vehicle.mileage || 0).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">km</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-success mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Current Location</p>
                  <p className="text-xs text-muted-foreground">{vehicle.location || "Unknown"}</p>
                </div>
              </div>

              {vehicle.driver && (
                <div className="p-2 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">Assigned Driver</p>
                  <p className="text-sm text-muted-foreground">{vehicle.driver}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEdit(vehicle)}
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDelete(vehicle.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No vehicles found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Start by adding your first vehicle"}
            </p>
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
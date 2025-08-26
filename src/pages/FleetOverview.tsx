import { useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Car, 
  Search, 
  Filter, 
  MapPin, 
  Fuel,
  Calendar,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockVehicles } from "@/lib/mockData";

export default function FleetOverview() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredVehicles = mockVehicles.filter(vehicle => {
    const matchesSearch = vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${vehicle.make} ${vehicle.model}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fleet Overview</h1>
          <p className="text-muted-foreground">Manage and monitor all vehicles in your fleet</p>
        </div>
        <Button variant="fleet">
          <Car className="w-4 h-4" />
          Add Vehicle
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={statusFilter === "online" ? "success" : "outline"}
                onClick={() => setStatusFilter("online")}
                size="sm"
              >
                Online
              </Button>
              <Button
                variant={statusFilter === "maintenance" ? "warning" : "outline"}
                onClick={() => setStatusFilter("maintenance")}
                size="sm"
              >
                Maintenance
              </Button>
              <Button
                variant={statusFilter === "offline" ? "destructive" : "outline"}
                onClick={() => setStatusFilter("offline")}
                size="sm"
              >
                Offline
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{vehicle.vehicleNumber}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Track Location</DropdownMenuItem>
                    <DropdownMenuItem>Schedule Maintenance</DropdownMenuItem>
                    <DropdownMenuItem>View History</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {vehicle.make} {vehicle.model} ({vehicle.year})
                </p>
                <StatusBadge status={vehicle.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Driver Info */}
              {vehicle.driver && (
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs text-primary-foreground font-medium">
                      {vehicle.driver.name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{vehicle.driver.name}</span>
                </div>
              )}

              {/* Vehicle Stats */}
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
                    <p className="text-sm font-medium">{vehicle.mileage.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Miles</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-success mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Current Location</p>
                  <p className="text-xs text-muted-foreground">{vehicle.location.address}</p>
                </div>
              </div>

              {/* Maintenance Info */}
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Next Maintenance</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(vehicle.nextMaintenance).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <MapPin className="w-3 h-3" />
                  Track
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <Card className="shadow-sm">
          <CardContent className="py-12 text-center">
            <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No vehicles found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
import { MetricCard } from "@/components/MetricCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Car, 
  MapPin, 
  Users, 
  Wrench, 
  Fuel, 
  TrendingUp,
  AlertCircle,
  Route
} from "lucide-react";
import { mockVehicles, mockDrivers, mockMaintenanceRecords } from "@/lib/mockData";

export default function Dashboard() {
  const activeVehicles = mockVehicles.filter(v => v.status === 'available' || v.status === 'in-use').length;
  const maintenanceAlerts = mockMaintenanceRecords.filter(r => r.status === 'cancelled' || r.status === 'pending').length;
  const activeDrivers = mockDrivers.filter(d => d.status === 'available' || d.status === 'busy').length;
  const avgFuelLevel = Math.round(mockVehicles.reduce((acc, v) => acc + v.fuelLevel, 0) / mockVehicles.length);

  const recentActivity = [
    { vehicle: "FL-001", action: "Trip completed", time: "2 minutes ago", type: "success" },
    { vehicle: "FL-002", action: "Maintenance due", time: "1 hour ago", type: "warning" },
    { vehicle: "FL-003", action: "Went offline", time: "3 hours ago", type: "error" },
    { vehicle: "FL-004", action: "Route started", time: "4 hours ago", type: "info" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fleet Dashboard</h1>
          <p className="text-muted-foreground">Monitor your fleet operations in real-time</p>
        </div>
        <Button variant="fleet" className="shadow-lg">
          <MapPin className="w-4 h-4" />
          Live Tracking
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Vehicles"
          value={`${activeVehicles}/${mockVehicles.length}`}
          change={{ value: "+2 from yesterday", trend: "up" }}
          icon={Car}
          iconColor="text-success"
        />
        <MetricCard
          title="Active Drivers"
          value={activeDrivers}
          change={{ value: "All available", trend: "neutral" }}
          icon={Users}
          iconColor="text-primary"
        />
        <MetricCard
          title="Maintenance Alerts"
          value={maintenanceAlerts}
          change={{ value: "2 overdue", trend: "down" }}
          icon={Wrench}
          iconColor="text-warning"
        />
        <MetricCard
          title="Avg Fuel Level"
          value={`${avgFuelLevel}%`}
          change={{ value: "-5% from last week", trend: "down" }}
          icon={Fuel}
          iconColor="text-accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fleet Status */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5 text-primary" />
              Fleet Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockVehicles.map((vehicle) => (
                <div key={vehicle.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Car className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{vehicle.vehicleNumber}</h4>
                      <p className="text-sm text-muted-foreground">
                        {vehicle.make} {vehicle.model}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">{vehicle.fuelLevel}% fuel</p>
                      <p className="text-xs text-muted-foreground">{vehicle.location.address}</p>
                    </div>
                    <StatusBadge status={vehicle.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-success' :
                    activity.type === 'warning' ? 'bg-warning' :
                    activity.type === 'error' ? 'bg-destructive' :
                    'bg-primary'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium text-sm text-foreground">
                      <span className="text-primary">{activity.vehicle}</span> • {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  {activity.type === 'warning' && (
                    <AlertCircle className="w-4 h-4 text-warning" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="flex items-center gap-3">
                <Route className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Plan Route</p>
                  <p className="text-sm text-muted-foreground">Optimize delivery routes</p>
                </div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="flex items-center gap-3">
                <Wrench className="w-5 h-5 text-warning" />
                <div className="text-left">
                  <p className="font-medium">Schedule Maintenance</p>
                  <p className="text-sm text-muted-foreground">Book service appointments</p>
                </div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-accent" />
                <div className="text-left">
                  <p className="font-medium">Assign Driver</p>
                  <p className="text-sm text-muted-foreground">Manage driver assignments</p>
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
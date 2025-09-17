import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Plus, Search, Edit, Trash2, Wrench, Calendar, DollarSign, Car } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useData, MaintenanceRecord } from "@/contexts/DataContext";

interface MaintenanceFormData {
  vehicleId: string;
  type: string;
  description: string;
  cost: number;
  date: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  nextDue: string | null;
}

export default function MaintenanceManagement() {
  const { maintenanceRecords, vehicles, addMaintenanceRecord, updateMaintenanceRecord, deleteMaintenanceRecord } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MaintenanceRecord | null>(null);
  const { toast } = useToast();
  
  const form = useForm<MaintenanceFormData>();
  
  const filteredRecords = maintenanceRecords.filter(record => {
    const vehicle = vehicles.find(v => v.id === record.vehicleId);
    const matchesSearch = vehicle?.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const onSubmit = (data: MaintenanceFormData) => {
    if (editingRecord) {
      updateMaintenanceRecord(editingRecord.id, data);
      toast({ title: "Maintenance record updated successfully" });
    } else {
      addMaintenanceRecord(data);
      toast({ title: "Maintenance record added successfully" });
    }
    
    setIsDialogOpen(false);
    setEditingRecord(null);
    form.reset();
  };

  const handleEdit = (record: MaintenanceRecord) => {
    setEditingRecord(record);
    form.reset(record);
    setIsDialogOpen(true);
  };

  const handleDelete = (recordId: string) => {
    deleteMaintenanceRecord(recordId);
    toast({ title: "Maintenance record deleted successfully", variant: "destructive" });
  };

  const handleAddNew = () => {
    setEditingRecord(null);
    form.reset({
      vehicleId: "",
      type: "Oil Change",
      description: "",
      cost: 0,
      date: new Date().toISOString().split('T')[0],
      status: "pending"
    });
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "success";
      case "pending": return "warning";
      case "in-progress": return "info";
      case "cancelled": return "destructive";
      default: return "secondary";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "scheduled": return "primary";
      case "repair": return "warning";
      case "inspection": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Maintenance Management</h1>
          <p className="text-muted-foreground">Schedule and track vehicle maintenance</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="w-4 h-4" />
              Schedule Maintenance
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingRecord ? "Edit Maintenance Record" : "Schedule New Maintenance"}
              </DialogTitle>
              <DialogDescription>
                {editingRecord ? "Update maintenance record information" : "Schedule maintenance for a fleet vehicle"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="vehicleId"
                  rules={{ required: "Vehicle is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select vehicle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vehicles.map(vehicle => (
                            <SelectItem key={vehicle.id} value={vehicle.id}>
                              {vehicle.vehicleNumber} - {vehicle.make} {vehicle.model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maintenance Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Oil Change">Oil Change</SelectItem>
                          <SelectItem value="Tire Replacement">Tire Replacement</SelectItem>
                          <SelectItem value="Engine Service">Engine Service</SelectItem>
                          <SelectItem value="Brake Service">Brake Service</SelectItem>
                          <SelectItem value="Inspection">Inspection</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter maintenance description..." 
                          {...field}
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cost"
                    rules={{ 
                      required: "Cost is required",
                      min: { value: 0, message: "Cost cannot be negative" }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost (USD)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="150" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="date"
                  rules={{ required: "Date is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maintenance Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="nextDue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Next Due Date (Optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingRecord ? "Update Record" : "Schedule Maintenance"}
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

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by vehicle or description..."
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
                variant={statusFilter === "pending" ? "warning" : "outline"}
                onClick={() => setStatusFilter("pending")}
                size="sm"
              >
                Pending
              </Button>
              <Button
                variant={statusFilter === "in-progress" ? "default" : "outline"}
                onClick={() => setStatusFilter("in-progress")}
                size="sm"
              >
                In Progress
              </Button>
              <Button
                variant={statusFilter === "completed" ? "success" : "outline"}
                onClick={() => setStatusFilter("completed")}
                size="sm"
              >
                Completed
              </Button>
              <Button
                variant={statusFilter === "cancelled" ? "destructive" : "outline"}
                onClick={() => setStatusFilter("cancelled")}
                size="sm"
              >
                Cancelled
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Records */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecords.map((record) => {
          const vehicle = vehicles.find(v => v.id === record.vehicleId);
          return (
            <Card key={record.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Wrench className="w-5 h-5" />
                    {vehicle?.vehicleNumber || "Unknown Vehicle"}
                  </CardTitle>
                  <Badge variant={getStatusColor(record.status) as any}>
                    {record.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getTypeColor(record.type) as any} className="text-xs">
                    {record.type}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {vehicle?.make} {vehicle?.model}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Description</p>
                  <p className="text-sm text-muted-foreground">{record.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-success" />
                    <div>
                      <p className="text-sm font-medium">${record.cost}</p>
                      <p className="text-xs text-muted-foreground">Cost</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(record.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Date</p>
                    </div>
                  </div>
                </div>

                {record.nextDue && (
                  <div className="p-2 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium">Next Due</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(record.nextDue).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEdit(record)}
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDelete(record.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredRecords.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Wrench className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No maintenance records found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Start by scheduling your first maintenance"}
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
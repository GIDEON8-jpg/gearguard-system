import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'available' | 'in-use' | 'maintenance' | 'out-of-service' | 'busy' | 'off-duty' | 'pending' | 'in-progress' | 'completed' | 'cancelled';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    available: {
      bg: "bg-status-online-light",
      text: "text-status-online",
      dot: "bg-status-online",
      label: "Available"
    },
    'in-use': {
      bg: "bg-warning-light",
      text: "text-warning",
      dot: "bg-warning",
      label: "In Use"
    },
    maintenance: {
      bg: "bg-status-maintenance-light",
      text: "text-status-maintenance",
      dot: "bg-status-maintenance",
      label: "Maintenance"
    },
    'out-of-service': {
      bg: "bg-status-offline-light",
      text: "text-status-offline",
      dot: "bg-status-offline",
      label: "Out of Service"
    },
    busy: {
      bg: "bg-warning-light",
      text: "text-warning",
      dot: "bg-warning",
      label: "Busy"
    },
    'off-duty': {
      bg: "bg-muted",
      text: "text-muted-foreground",
      dot: "bg-muted-foreground",
      label: "Off Duty"
    },
    completed: {
      bg: "bg-success-light",
      text: "text-success",
      dot: "bg-success",
      label: "Completed"
    },
    pending: {
      bg: "bg-warning-light",
      text: "text-warning",
      dot: "bg-warning",
      label: "Pending"
    },
    'in-progress': {
      bg: "bg-primary-light",
      text: "text-primary",
      dot: "bg-primary",
      label: "In Progress"
    },
    cancelled: {
      bg: "bg-destructive-light",
      text: "text-destructive",
      dot: "bg-destructive",
      label: "Cancelled"
    }
  };

  const config = statusConfig[status];

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium",
      config.bg,
      config.text,
      className
    )}>
      <div className={cn("w-2 h-2 rounded-full", config.dot)} />
      {config.label}
    </div>
  );
}
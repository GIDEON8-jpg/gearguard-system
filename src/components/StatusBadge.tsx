import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'online' | 'maintenance' | 'offline' | 'active' | 'inactive' | 'completed' | 'pending' | 'overdue';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    online: {
      bg: "bg-status-online-light",
      text: "text-status-online",
      dot: "bg-status-online",
      label: "Online"
    },
    maintenance: {
      bg: "bg-status-maintenance-light",
      text: "text-status-maintenance",
      dot: "bg-status-maintenance",
      label: "Maintenance"
    },
    offline: {
      bg: "bg-status-offline-light",
      text: "text-status-offline",
      dot: "bg-status-offline",
      label: "Offline"
    },
    active: {
      bg: "bg-success-light",
      text: "text-success",
      dot: "bg-success",
      label: "Active"
    },
    inactive: {
      bg: "bg-muted",
      text: "text-muted-foreground",
      dot: "bg-muted-foreground",
      label: "Inactive"
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
    overdue: {
      bg: "bg-destructive-light",
      text: "text-destructive",
      dot: "bg-destructive",
      label: "Overdue"
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

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "active" | "completed" | "on-hold";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        {
          "bg-green-100 text-green-800": status === "active",
          "bg-blue-100 text-blue-800": status === "completed",
          "bg-yellow-100 text-yellow-800": status === "on-hold",
        },
        className
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
}

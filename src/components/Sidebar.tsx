
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Building2, Users, FolderKanban, LayoutDashboard } from "lucide-react";

const navItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Customers",
    path: "/customers",
    icon: Building2,
  },
  {
    name: "Projects",
    path: "/projects",
    icon: FolderKanban,
  },
  {
    name: "Employees",
    path: "/employees",
    icon: Users,
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="min-h-screen w-64 bg-sidebar border-r border-border">
      <div className="p-4">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <FolderKanban className="h-6 w-6" />
          Staff Nexus
        </h1>
      </div>
      <nav className="px-2 py-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors my-1",
              location.pathname === item.path
                ? "bg-primary/10 text-primary"
                : "hover:bg-background/10"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}

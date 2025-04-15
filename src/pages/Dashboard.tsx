
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Building2, Users, FolderKanban, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { customers, projects, employees } = useAppContext();

  // Calculate statistics
  const activeProjects = projects.filter(
    (project) => project.status === "active"
  ).length;
  const completedProjects = projects.filter(
    (project) => project.status === "completed"
  ).length;
  const onHoldProjects = projects.filter(
    (project) => project.status === "on-hold"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6" /> Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link to="/customers" className="block">
              <div className="text-2xl font-bold hover:underline">
                {customers.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Total registered customers
              </p>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link to="/projects" className="block">
              <div className="text-2xl font-bold hover:underline">
                {projects.length}
              </div>
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <Link to="/projects?status=active" className="text-xs text-muted-foreground hover:underline">
                {activeProjects} active
              </Link>
              <Link to="/projects?status=completed" className="text-xs text-muted-foreground hover:underline">
                {completedProjects} completed
              </Link>
              <Link to="/projects?status=on-hold" className="text-xs text-muted-foreground hover:underline">
                {onHoldProjects} on hold
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link to="/employees" className="block">
              <div className="text-2xl font-bold hover:underline">
                {employees.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Total team members
              </p>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {projects.slice(0, 4).map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-2 border border-border rounded-md"
                >
                  <div>
                    <Link
                      to={`/projects/${project.id}`}
                      className="font-medium hover:underline"
                    >
                      {project.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {project.description.substring(0, 50)}
                      {project.description.length > 50 ? "..." : ""}
                    </p>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
              ))}
              <div className="mt-4">
                <Link
                  to="/projects"
                  className="text-sm text-primary hover:underline"
                >
                  View all projects
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {customers.slice(0, 4).map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between p-2 border border-border rounded-md"
                >
                  <div>
                    <Link
                      to={`/customers/${customer.id}`}
                      className="font-medium hover:underline"
                    >
                      {customer.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {customer.email}
                    </p>
                  </div>
                </div>
              ))}
              <div className="mt-4">
                <Link
                  to="/customers"
                  className="text-sm text-primary hover:underline"
                >
                  View all customers
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

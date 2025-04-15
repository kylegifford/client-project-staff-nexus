
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/ui/status-badge";
import { 
  FolderKanban, 
  MoreVertical, 
  PlusCircle, 
  Search, 
  Users
} from "lucide-react";

export default function ProjectsList() {
  const { 
    projects, 
    deleteProject, 
    getCustomerById, 
    getEmployeesByProjectId 
  } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const statusFilter = queryParams.get("status");

  // Filter projects by status if the status filter is present
  const statusFilteredProjects = statusFilter 
    ? projects.filter(project => project.status === statusFilter)
    : projects;

  // Then apply text search filter on top of the status filtering
  const filteredProjects = statusFilteredProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FolderKanban className="h-6 w-6" /> Projects
            {statusFilter && (
              <span className="text-lg font-medium ml-2">
                ({statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)})
              </span>
            )}
          </h1>
          <p className="text-muted-foreground">
            Manage your project database
          </p>
        </div>
        <Button asChild>
          <Link to="/projects/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Project
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {statusFilter 
                  ? `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Projects` 
                  : "All Projects"}
              </CardTitle>
              <CardDescription>
                {statusFilter
                  ? `Showing ${filteredProjects.length} ${statusFilter} project(s)`
                  : "A list of all projects in your database"}
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search projects..."
                className="pl-8 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {statusFilter && (
            <div className="mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                asChild 
                className="mb-4"
              >
                <Link to="/projects">Clear filter</Link>
              </Button>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Team Size</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No projects found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project) => {
                  const customer = getCustomerById(project.customerId);
                  return (
                    <TableRow key={project.id}>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
                        {customer ? (
                          <Link 
                            to={`/customers/${customer.id}`}
                            className="hover:underline"
                          >
                            {customer.name}
                          </Link>
                        ) : (
                          "Unknown Customer"
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={project.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{getEmployeesByProjectId(project.id).length}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(project.startDate)}</TableCell>
                      <TableCell>
                        {project.endDate 
                          ? formatDate(project.endDate) 
                          : "In progress"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              aria-label="Open menu"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/projects/${project.id}`}>View</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/projects/edit/${project.id}`}>
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (
                                  window.confirm(
                                    "Are you sure you want to delete this project?"
                                  )
                                ) {
                                  deleteProject(project.id);
                                }
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

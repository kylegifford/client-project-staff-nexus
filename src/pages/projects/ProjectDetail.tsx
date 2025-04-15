
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  ArrowLeft,
  Building2,
  CalendarIcon,
  FolderKanban,
  PencilIcon,
  PlusCircle,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getProjectById, 
    deleteProject, 
    getCustomerById, 
    getEmployeesByProjectId 
  } = useAppContext();

  const project = getProjectById(id!);
  const customer = project ? getCustomerById(project.customerId) : null;
  const assignedEmployees = project ? getEmployeesByProjectId(project.id) : [];

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <Button asChild>
          <Link to="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject(project.id);
      navigate("/projects");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{project.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/projects/edit/${project.id}`}>
              <PencilIcon className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{project.description}</p>
              </div>
              
              <div className="flex items-start gap-2">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <Link to={`/customers/${project.customerId}`} className="font-medium hover:underline">
                    {customer?.name || "Unknown Customer"}
                  </Link>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="h-5 w-5 flex-shrink-0 mt-0.5">
                  <StatusBadge status={project.status} className="mt-1" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{project.status}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Timeline</p>
                  <p className="font-medium">
                    From {formatDate(project.startDate)}
                    {project.endDate ? ` to ${formatDate(project.endDate)}` : " (ongoing)"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Team Size</p>
                  <p className="font-medium">{assignedEmployees.length} employees</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="team">
            <TabsList>
              <TabsTrigger value="team">Team Members</TabsTrigger>
            </TabsList>
            <TabsContent value="team" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>
                      Employees assigned to this project
                    </CardDescription>
                  </div>
                  <Button asChild>
                    <Link to={`/projects/assign/${project.id}`}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Manage Team
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {assignedEmployees.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">
                        No employees assigned to this project.
                      </p>
                      <Button asChild className="mt-4">
                        <Link to={`/projects/assign/${project.id}`}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Assign Employees
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Email</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assignedEmployees.map((employee) => (
                          <TableRow key={employee.id}>
                            <TableCell>
                              <Link
                                to={`/employees/${employee.id}`}
                                className="font-medium hover:underline"
                              >
                                {employee.name}
                              </Link>
                            </TableCell>
                            <TableCell>{employee.position}</TableCell>
                            <TableCell>{employee.department}</TableCell>
                            <TableCell>{employee.email}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

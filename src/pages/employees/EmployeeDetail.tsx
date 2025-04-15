
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
import { StatusBadge } from "@/components/ui/status-badge";
import {
  ArrowLeft,
  Briefcase,
  Building,
  CalendarIcon,
  Mail,
  PencilIcon,
  Trash2,
  User,
} from "lucide-react";

export default function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEmployeeById, deleteEmployee, projects, getCustomerById } = useAppContext();

  const employee = getEmployeeById(id!);

  // Find all projects this employee is assigned to
  const employeeProjects = projects.filter(project => 
    project.assignedEmployees.includes(id!)
  );

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Employee not found</h1>
        <Button asChild>
          <Link to="/employees">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Employees
          </Link>
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      deleteEmployee(employee.id);
      navigate("/employees");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/employees">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{employee.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/employees/edit/${employee.id}`}>
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
            <CardTitle>Employee Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{employee.name}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{employee.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Position</p>
                  <p className="font-medium">{employee.position}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{employee.department}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Hire Date</p>
                  <p className="font-medium">{formatDate(employee.hireDate)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Projects</CardTitle>
              <CardDescription>
                Projects this employee is currently working on
              </CardDescription>
            </CardHeader>
            <CardContent>
              {employeeProjects.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">
                    Not assigned to any projects.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employeeProjects.map((project) => (
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
                          {getCustomerById(project.customerId)?.name || "Unknown"}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={project.status} />
                        </TableCell>
                        <TableCell>{formatDate(project.startDate)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

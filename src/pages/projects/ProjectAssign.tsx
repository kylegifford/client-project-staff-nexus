
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
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
  ArrowLeft,
  Check,
  FolderKanban,
  Search,
  UserMinus,
  UserPlus,
  X,
} from "lucide-react";

export default function ProjectAssign() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getProjectById,
    updateProject,
    employees,
    getEmployeesByProjectId,
  } = useAppContext();

  const project = getProjectById(id!);
  const [searchTerm, setSearchTerm] = useState("");
  const [assignedEmployeeIds, setAssignedEmployeeIds] = useState<string[]>([]);

  useEffect(() => {
    if (project) {
      setAssignedEmployeeIds(project.assignedEmployees);
    }
  }, [project]);

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

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleEmployee = (employeeId: string) => {
    setAssignedEmployeeIds((current) => {
      if (current.includes(employeeId)) {
        return current.filter((id) => id !== employeeId);
      } else {
        return [...current, employeeId];
      }
    });
  };

  const handleSave = () => {
    updateProject(project.id, {
      assignedEmployees: assignedEmployeeIds,
    });
    navigate(`/projects/${project.id}`);
  };

  // Group employees by department
  const employeesByDepartment = filteredEmployees.reduce(
    (acc, employee) => {
      if (!acc[employee.department]) {
        acc[employee.department] = [];
      }
      acc[employee.department].push(employee);
      return acc;
    },
    {} as Record<string, typeof employees>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FolderKanban className="h-6 w-6" />
            Assign Team Members
          </h1>
          <p className="text-muted-foreground">
            {project.name} - Select employees to assign to this project
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleSave}>
            <Check className="mr-2 h-4 w-4" />
            Save Assignments
          </Button>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search employees by name, position, or department"
          className="pl-8 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-6">
        {Object.entries(employeesByDepartment).map(
          ([department, departmentEmployees]) => (
            <Card key={department}>
              <CardHeader>
                <CardTitle>{department}</CardTitle>
                <CardDescription>
                  {departmentEmployees.length} employees in this department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {departmentEmployees.map((employee) => {
                    const isAssigned = assignedEmployeeIds.includes(employee.id);
                    return (
                      <div
                        key={employee.id}
                        className={`p-4 border rounded-lg flex items-start justify-between ${
                          isAssigned
                            ? "bg-primary/10 border-primary/20"
                            : "hover:bg-accent"
                        }`}
                      >
                        <div>
                          <h3 className="font-medium">{employee.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {employee.position}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {employee.email}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant={isAssigned ? "default" : "outline"}
                          onClick={() => handleToggleEmployee(employee.id)}
                          className={isAssigned ? "bg-primary" : ""}
                        >
                          {isAssigned ? (
                            <>
                              <UserMinus className="h-4 w-4 mr-1" /> Remove
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-1" /> Assign
                            </>
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";

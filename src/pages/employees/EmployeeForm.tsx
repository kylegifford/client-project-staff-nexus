
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ArrowLeft, CalendarIcon, Users } from "lucide-react";

interface EmployeeFormData {
  name: string;
  email: string;
  position: string;
  department: string;
  hireDate: Date;
}

const departmentOptions = [
  "Engineering",
  "Design",
  "Management",
  "Marketing",
  "Sales",
  "Customer Support",
  "Finance",
  "HR",
];

export default function EmployeeForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addEmployee, updateEmployee, getEmployeeById } = useAppContext();

  const isEditing = Boolean(id);
  const employee = isEditing ? getEmployeeById(id!) : null;

  const [formData, setFormData] = useState<EmployeeFormData>({
    name: "",
    email: "",
    position: "",
    department: "",
    hireDate: new Date(),
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeFormData, string>>>({});

  useEffect(() => {
    if (isEditing && employee) {
      setFormData({
        name: employee.name,
        email: employee.email,
        position: employee.position,
        department: employee.department,
        hireDate: new Date(employee.hireDate),
      });
    }
  }, [isEditing, employee]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EmployeeFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.position.trim()) {
      newErrors.position = "Position is required";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    if (!formData.hireDate) {
      newErrors.hireDate = "Hire date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the error when the user starts typing
    if (errors[name as keyof EmployeeFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the error
    if (errors[name as keyof EmployeeFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, [name]: date || new Date() }));
    // Clear the error
    if (errors[name as keyof EmployeeFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const employeeData = {
      ...formData,
      hireDate: formData.hireDate.toISOString(),
    };

    if (isEditing && employee) {
      updateEmployee(employee.id, employeeData);
      navigate(`/employees/${employee.id}`);
    } else {
      const newEmployee = addEmployee(employeeData);
      navigate(`/employees/${newEmployee.id}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            {isEditing ? "Edit Employee" : "New Employee"}
          </h1>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="Enter job position"
                  className={errors.position ? "border-red-500" : ""}
                />
                {errors.position && (
                  <p className="text-sm text-red-500">{errors.position}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) =>
                    handleSelectChange("department", value)
                  }
                >
                  <SelectTrigger
                    className={errors.department ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentOptions.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && (
                  <p className="text-sm text-red-500">{errors.department}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hireDate">Hire Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        errors.hireDate ? "border-red-500" : "",
                        !formData.hireDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.hireDate ? (
                        format(formData.hireDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.hireDate}
                      onSelect={(date) => handleDateChange("hireDate", date)}
                    />
                  </PopoverContent>
                </Popover>
                {errors.hireDate && (
                  <p className="text-sm text-red-500">{errors.hireDate}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? "Update Employee" : "Create Employee"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

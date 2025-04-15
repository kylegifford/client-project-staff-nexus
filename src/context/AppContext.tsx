
import { createContext, useContext, useState, ReactNode } from "react";
import { Customer, Project, Employee } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface AppContextType {
  customers: Customer[];
  projects: Project[];
  employees: Employee[];
  addCustomer: (customer: Omit<Customer, "id" | "createdAt">) => Customer;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addProject: (project: Omit<Project, "id">) => Project;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addEmployee: (employee: Omit<Employee, "id">) => Employee;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  getCustomerById: (id: string) => Customer | undefined;
  getProjectById: (id: string) => Project | undefined;
  getEmployeeById: (id: string) => Employee | undefined;
  getProjectsByCustomerId: (customerId: string) => Project[];
  getEmployeesByProjectId: (projectId: string) => Employee[];
  getCustomerByProjectId: (projectId: string) => Customer | undefined;
}

// Sample data
const initialCustomers: Customer[] = [
  {
    id: "c1",
    name: "Acme Corporation",
    email: "contact@acme.com",
    phone: "555-123-4567",
    createdAt: new Date(2023, 1, 15).toISOString(),
  },
  {
    id: "c2",
    name: "Globex Industries",
    email: "info@globex.com",
    phone: "555-987-6543",
    createdAt: new Date(2023, 2, 20).toISOString(),
  },
  {
    id: "c3",
    name: "Stark Enterprises",
    email: "hello@stark.com",
    phone: "555-789-0123",
    createdAt: new Date(2023, 3, 10).toISOString(),
  },
];

const initialProjects: Project[] = [
  {
    id: "p1",
    name: "Website Redesign",
    description: "Complete overhaul of company website with modern design",
    status: "active",
    customerId: "c1",
    startDate: new Date(2023, 3, 1).toISOString(),
    assignedEmployees: ["e1", "e2"],
  },
  {
    id: "p2",
    name: "Mobile App Development",
    description: "iOS and Android app for customer portal",
    status: "active",
    customerId: "c2",
    startDate: new Date(2023, 2, 15).toISOString(),
    assignedEmployees: ["e3", "e4"],
  },
  {
    id: "p3",
    name: "Brand Identity Update",
    description: "Logo redesign and brand guidelines creation",
    status: "completed",
    customerId: "c1",
    startDate: new Date(2023, 1, 1).toISOString(),
    endDate: new Date(2023, 2, 28).toISOString(),
    assignedEmployees: ["e2", "e5"],
  },
  {
    id: "p4",
    name: "Data Migration",
    description: "Transfer of legacy data to new system",
    status: "on-hold",
    customerId: "c3",
    startDate: new Date(2023, 4, 10).toISOString(),
    assignedEmployees: ["e1", "e5"],
  },
];

const initialEmployees: Employee[] = [
  {
    id: "e1",
    name: "John Doe",
    email: "john.doe@company.com",
    position: "Senior Developer",
    department: "Engineering",
    hireDate: new Date(2020, 5, 12).toISOString(),
  },
  {
    id: "e2",
    name: "Jane Smith",
    email: "jane.smith@company.com",
    position: "UX Designer",
    department: "Design",
    hireDate: new Date(2021, 2, 15).toISOString(),
  },
  {
    id: "e3",
    name: "Robert Johnson",
    email: "robert.johnson@company.com",
    position: "Project Manager",
    department: "Management",
    hireDate: new Date(2019, 8, 3).toISOString(),
  },
  {
    id: "e4",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    position: "Mobile Developer",
    department: "Engineering",
    hireDate: new Date(2022, 0, 10).toISOString(),
  },
  {
    id: "e5",
    name: "Michael Wilson",
    email: "michael.wilson@company.com",
    position: "Graphic Designer",
    department: "Design",
    hireDate: new Date(2021, 6, 22).toISOString(),
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  const addCustomer = (customer: Omit<Customer, "id" | "createdAt">) => {
    const newCustomer = {
      ...customer,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    setCustomers((prev) => [...prev, newCustomer]);
    return newCustomer;
  };

  const updateCustomer = (id: string, customerData: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === id ? { ...customer, ...customerData } : customer
      )
    );
  };

  const deleteCustomer = (id: string) => {
    // Delete associated projects first
    const customerProjects = projects.filter(
      (project) => project.customerId === id
    );
    customerProjects.forEach((project) => deleteProject(project.id));
    
    setCustomers((prev) => prev.filter((customer) => customer.id !== id));
  };

  const addProject = (project: Omit<Project, "id">) => {
    const newProject = {
      ...project,
      id: uuidv4(),
    };
    setProjects((prev) => [...prev, newProject]);
    return newProject;
  };

  const updateProject = (id: string, projectData: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id ? { ...project, ...projectData } : project
      )
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
  };

  const addEmployee = (employee: Omit<Employee, "id">) => {
    const newEmployee = {
      ...employee,
      id: uuidv4(),
    };
    setEmployees((prev) => [...prev, newEmployee]);
    return newEmployee;
  };

  const updateEmployee = (id: string, employeeData: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === id ? { ...employee, ...employeeData } : employee
      )
    );
  };

  const deleteEmployee = (id: string) => {
    // Update any projects that have this employee assigned
    setProjects((prev) =>
      prev.map((project) => ({
        ...project,
        assignedEmployees: project.assignedEmployees.filter(
          (employeeId) => employeeId !== id
        ),
      }))
    );
    
    setEmployees((prev) => prev.filter((employee) => employee.id !== id));
  };

  const getCustomerById = (id: string) => {
    return customers.find((customer) => customer.id === id);
  };

  const getProjectById = (id: string) => {
    return projects.find((project) => project.id === id);
  };

  const getEmployeeById = (id: string) => {
    return employees.find((employee) => employee.id === id);
  };

  const getProjectsByCustomerId = (customerId: string) => {
    return projects.filter((project) => project.customerId === customerId);
  };

  const getEmployeesByProjectId = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return [];
    return employees.filter((employee) =>
      project.assignedEmployees.includes(employee.id)
    );
  };

  const getCustomerByProjectId = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return undefined;
    return customers.find((c) => c.id === project.customerId);
  };

  return (
    <AppContext.Provider
      value={{
        customers,
        projects,
        employees,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addProject,
        updateProject,
        deleteProject,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        getCustomerById,
        getProjectById,
        getEmployeeById,
        getProjectsByCustomerId,
        getEmployeesByProjectId,
        getCustomerByProjectId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

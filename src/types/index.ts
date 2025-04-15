
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  customerId: string;
  startDate: string;
  endDate?: string;
  assignedEmployees: string[];
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  hireDate: string;
}

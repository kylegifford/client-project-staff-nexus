
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
  Mail,
  PencilIcon,
  Phone,
  PlusCircle,
  Trash2,
} from "lucide-react";

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCustomerById, getProjectsByCustomerId, deleteCustomer } = useAppContext();

  const customer = getCustomerById(id!);
  const customerProjects = getProjectsByCustomerId(id!);

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Customer not found</h1>
        <Button asChild>
          <Link to="/customers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Customers
          </Link>
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this customer? This will also delete all associated projects.")) {
      deleteCustomer(customer.id);
      navigate("/customers");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/customers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{customer.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/customers/edit/${customer.id}`}>
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
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{customer.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{customer.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Customer since</p>
                  <p className="font-medium">{formatDate(customer.createdAt)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="projects">
            <TabsList>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>
            <TabsContent value="projects" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Projects</CardTitle>
                    <CardDescription>
                      Projects assigned to this customer
                    </CardDescription>
                  </div>
                  <Button asChild>
                    <Link to={`/projects/new?customerId=${customer.id}`}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Project
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {customerProjects.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">
                        No projects found for this customer.
                      </p>
                      <Button asChild className="mt-4">
                        <Link to={`/projects/new?customerId=${customer.id}`}>
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Create Project
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Project Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Start Date</TableHead>
                          <TableHead>End Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customerProjects.map((project) => (
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
                              <StatusBadge status={project.status} />
                            </TableCell>
                            <TableCell>{formatDate(project.startDate)}</TableCell>
                            <TableCell>
                              {project.endDate
                                ? formatDate(project.endDate)
                                : "In progress"}
                            </TableCell>
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

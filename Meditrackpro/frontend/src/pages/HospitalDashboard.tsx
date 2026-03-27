import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus, Hospital, Users, Stethoscope, ShieldCheck,
  User, Search, UserCog, X, Check, Filter, Trash2, Edit
} from "lucide-react";
import axios, { AxiosError } from "axios";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/utils/api";
import { baseUrl } from "@/utils/apiconfig";
import { motion } from "framer-motion";

interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  username?: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  access: "admin" | "full" | "standard" | "limited" | "none";
  image?: string;
  dateOfBirth?:string;
  employeeId?:string;
}

interface BackendError {
  message?: string;
  error?: string;
}

const employeeFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(1, { message: "Last name must be at least 1 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  role: z.string().min(1, { message: "Role is required" }),
  department: z.string().min(1, { message: "Department is required" }),
  accessLevel: z.string().min(1, { message: "Access level is required" }),
  dateOfBirth: z.string()
  .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" })
  .refine((val) => {
    const birthDate = new Date(val);
    const today = new Date("2025-03-27"); // Current date per system info
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    // Adjust age if birthday hasn't occurred this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      return age - 1 >= 18;
    }
    return age >= 18;
  }, { message: "Employee must be at least 18 years old" }),
  employeeId: z.string().min(1, { message: "Employee ID is required" }), 
});

const editEmployeeSchema = z.object({
  status: z.enum(["active", "inactive"]),
  accessLevel: z.enum(["admin", "full", "standard", "limited", "none"]),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
type EditEmployeeValues = z.infer<typeof editEmployeeSchema>;

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [editEmployeeOpen, setEditEmployeeOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  const hospitalId = localStorage.getItem("hospitalid");

  const addForm = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      role: "",
      department: "",
      accessLevel: "standard",
      dateOfBirth: "", 
      employeeId: "",
    },
  });

  const editForm = useForm<EditEmployeeValues>({
    resolver: zodResolver(editEmployeeSchema),
    defaultValues: {
      status: "active",
      accessLevel: "standard",
    },
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const endpoint = hospitalId ? `/api/hospitals/${hospitalId}/employees/` : `/api/employees/`;
        console.log("Fetching from:", `${baseUrl}${endpoint}`);
        const response = await api.get<Employee[]>(endpoint, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setEmployees(response.data);
      } catch (error) {
        const axiosError = error as AxiosError<BackendError>;
        toast({
          title: "Error",
          description: axiosError.response?.data?.message || "Failed to fetch employees",
          variant: "destructive",
        });
      }
    };
    fetchEmployees();
  }, [hospitalId, toast]);

  const onAddEmployee = async (data: EmployeeFormValues) => {
    try {
      const payload = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        username: data.email,
        phone_number: data.phone,
        password: data.password,
        role: data.role.toLowerCase(),
        department: data.department.toLowerCase(),
        access_level: data.accessLevel,
        hospital: hospitalId ? parseInt(hospitalId) : null,
        date_of_birth: data.dateOfBirth, // New field
        employee_id: data.employeeId, 
      };
      const endpoint = hospitalId ? `/api/hospitals/${hospitalId}/employees/create/` : `/api/employees/create/`;
      const response = await api.post<{ employee_id: number }>(endpoint, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const newEmployee: Employee = {
        id: response.data.employee_id,
        name: `${data.firstName} ${data.lastName}`,
        role: data.role,
        department: data.department,
        email: data.email,
        phone: data.phone,
        status: "active",
        access: data.accessLevel as "admin" | "full" | "standard" | "limited" | "none",
        dateOfBirth: data.dateOfBirth, // New field
        employeeId: data.employeeId, 
      };

      setEmployees([...employees, newEmployee]);
      toast({ title: "Employee Added", description: `${data.firstName} ${data.lastName} has been added successfully` });
      setAddEmployeeOpen(false);
      addForm.reset();
    } catch (error) {
      const axiosError = error as AxiosError<BackendError>;
      toast({
        title: "Error",
        description: axiosError.response?.data?.message || "Failed to add employee",
        variant: "destructive",
      });
    }
  };

  const onEditEmployee = async (data: EditEmployeeValues) => {
    if (!selectedEmployee) return;
    try {
      const payload = {
        status: data.status,
        access_level: data.accessLevel,
      };
      const endpoint = `/api/employees/${selectedEmployee.id}/update/`;  // Should be 8 if mapped right
      console.log("Editing at:", `${baseUrl}${endpoint}`, "Payload:", payload);
      await api.patch(endpoint, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      setEmployees(employees.map(emp =>
        emp.id === selectedEmployee.id ? { ...emp, status: data.status, access: data.accessLevel } : emp
      ));
      toast({ title: "Employee Updated", description: `${selectedEmployee.name} has been updated` });
      setEditEmployeeOpen(false);
      setSelectedEmployee(null);
    } catch (error) {
      const axiosError = error as AxiosError<BackendError>;
      toast({
        title: "Error",
        description: axiosError.response?.data?.message || "Failed to update employee",
        variant: "destructive",
      });
      console.error("Edit error:", axiosError.response?.data);
    }
  };

  const onDeleteEmployee = async () => {
  if (!selectedEmployee) return;
  try {
    const endpoint = `/api/employees/${selectedEmployee.id}/delete/`;  // Should be 8
    console.log("Deleting at:", `${baseUrl}${endpoint}`);
    await api.delete(endpoint, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    setEmployees(employees.filter(emp => emp.id !== selectedEmployee.id));
    toast({ title: "Employee Deleted", description: `${selectedEmployee.name} has been removed` });
    setDeleteConfirmOpen(false);
    setSelectedEmployee(null);
  } catch (error) {
    const axiosError = error as AxiosError<BackendError>;
    toast({
      title: "Error",
      description: axiosError.response?.data?.message || "Failed to delete employee",
      variant: "destructive",
    });
    console.error("Delete error:", axiosError.response?.data);
  }
};

  const openEditDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    editForm.reset({ status: employee.status, accessLevel: employee.access });
    setEditEmployeeOpen(true);
  };

  const openDeleteDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDeleteConfirmOpen(true);
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || employee.role.toLowerCase() === filterRole.toLowerCase();
    const matchesStatus = filterStatus === "all" || employee.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const redirectToMediTrackPro = () => navigate("/dashboard");

  return (
    <motion.div
    initial={{ opacity: 0, width: "50%" }} // Start narrower
    animate={{ opacity: 1, width: "100%" }} // Expand to full width
    transition={{ duration: 0.7, ease: "easeInOut" }}
    >
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Hospital Administration</h1>
            <p className="text-muted-foreground">Manage hospital staff and access to MediTrack Pro</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={redirectToMediTrackPro}>
              <Hospital className="h-4 w-4 mr-2" />
              Access MediTrack Pro
            </Button>
            <Button onClick={() => setAddEmployeeOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Hospital Staff Management</CardTitle>
                <CardDescription>Add, modify, or remove staff members and control their access to MediTrack Pro</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search employees..."
                    className="w-full pl-8 md:w-[200px] lg:w-[300px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-[110px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Role</span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="doctor">Doctors</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="nurse">Nurses</SelectItem>
                      <SelectItem value="Engineer">Engineer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as "all" | "active" | "inactive")}>
                    <SelectTrigger className="w-[130px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Status</span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium">Employee</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Department</th>
                      <th className="hidden md:table-cell px-4 py-3 text-left text-sm font-medium">Contact</th>
                      <th className="hidden lg:table-cell px-4 py-3 text-left text-sm font-medium">Access Level</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((employee) => (
                        <tr key={employee.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage src={employee.image} alt={employee.name} />
                                <AvatarFallback className="text-xs">{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{employee.name}</div>
                                <div className="text-sm text-muted-foreground">{employee.role}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">{employee.department.toLocaleUpperCase()}</td>
                          <td className="hidden md:table-cell px-4 py-3 text-sm">
                            <div className="text-sm">{employee.email}</div>
                            <div className="text-xs text-muted-foreground">{employee.phone}</div>
                          </td>
                          <td className="hidden lg:table-cell px-4 py-3 text-sm">
                            <Badge variant={
                              employee.access === "admin" ? "default" :
                              employee.access === "full" ? "default" :
                              employee.access === "standard" ? "outline" :
                              "secondary"
                            }>
                              {employee.access === "admin" ? "Administrator" :
                               employee.access === "full" ? "Full Access" :
                               employee.access === "standard" ? "Standard" :
                               "Limited"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={employee.status === "active" ? "success" : "destructive"}>
                              {employee.status === "active" ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(employee)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDeleteDialog(employee)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                          No employees found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rest of the UI (Hospital Overview) unchanged */}
        <Card>
          <CardHeader>
            <CardTitle>Hospital Overview</CardTitle>
            <CardDescription>Key statistics and information about your hospital</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2 p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium">Total Staff</h3>
                </div>
                <p className="text-3xl font-bold">{employees.filter(e => e.status === "active").length}</p>
                <p className="text-sm text-muted-foreground">Active employees</p>
              </div>
              <div className="flex flex-col gap-2 p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-purple-500/10">
                    <Stethoscope className="h-5 w-5 text-purple-500" />
                  </div>
                  <h3 className="font-medium">Medical Staff</h3>
                </div>
                <p className="text-3xl font-bold">{employees.filter(e => e.role === "Doctor" && e.status === "active").length}</p>
                <p className="text-sm text-muted-foreground">Active doctors</p>
              </div>
              <div className="flex flex-col gap-2 p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-green-500/10">
                    <ShieldCheck className="h-5 w-5 text-green-500" />
                  </div>
                  <h3 className="font-medium">System Access</h3>
                </div>
                <p className="text-3xl font-bold">{employees.filter(e => e.access === "admin" || e.access === "full").length}</p>
                <p className="text-sm text-muted-foreground">Full access users</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" onClick={redirectToMediTrackPro}>
              Go to MediTrack Pro
            </Button>
            <Button onClick={() => setAddEmployeeOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Add Employee Dialog (unchanged) */}
      <Dialog open={addEmployeeOpen} onOpenChange={setAddEmployeeOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>Add a new staff member and set their access to MediTrack Pro</DialogDescription>
            </DialogHeader>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(onAddEmployee)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField control={addForm.control} name="firstName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl><Input placeholder="Enter first name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={addForm.control} name="lastName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl><Input placeholder="Enter last name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField control={addForm.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input placeholder="email@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={addForm.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl><Input placeholder="Enter phone number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField control={addForm.control} name="dateOfBirth" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={addForm.control} name="employeeId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID</FormLabel>
                      <FormControl><Input placeholder="Enter employee ID" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={addForm.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl><Input type="password" placeholder="Enter password" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField control={addForm.control} name="role" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Doctor">Doctor</SelectItem>
                          <SelectItem value="Staff">Staff</SelectItem>
                          <SelectItem value="Nurse">Nurse</SelectItem>
                          <SelectItem value="Engineer">Engineer</SelectItem>
                          <SelectItem value="Receptionist">Receptionist</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={addForm.control} name="department" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Cardiology">Cardiology</SelectItem>
                          <SelectItem value="Neurology">Neurology</SelectItem>
                          <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                          <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                          <SelectItem value="Radiology">Radiology</SelectItem>
                          <SelectItem value="Emergency">Emergency</SelectItem>
                          <SelectItem value="IT">IT</SelectItem>
                          <SelectItem value="Administration">Administration</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={addForm.control} name="accessLevel" render={({ field }) => (
                  <FormItem>
                    <FormLabel>MediTrack Pro Access Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select access level" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Administrator (Full Control)</SelectItem>
                        <SelectItem value="full">Full Access</SelectItem>
                        <SelectItem value="standard">Standard Access</SelectItem>
                        <SelectItem value="limited">Limited Access</SelectItem>
                        <SelectItem value="none">No Access</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>This determines what features and data they can access in MediTrack Pro</FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setAddEmployeeOpen(false)}>Cancel</Button>
                  <Button type="submit">Add Employee</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={editEmployeeOpen} onOpenChange={setEditEmployeeOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>Modify status and access level for {selectedEmployee?.name}</DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditEmployee)} className="space-y-4">
              <FormField control={editForm.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={editForm.control} name="accessLevel" render={({ field }) => (
                <FormItem>
                  <FormLabel>Access Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select access level" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Administrator (Full Control)</SelectItem>
                      <SelectItem value="full">Full Access</SelectItem>
                      <SelectItem value="standard">Standard Access</SelectItem>
                      <SelectItem value="limited">Limited Access</SelectItem>
                      <SelectItem value="none">No Access</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditEmployeeOpen(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedEmployee?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={onDeleteEmployee}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
    </motion.div>
  );
};

export default HospitalDashboard;
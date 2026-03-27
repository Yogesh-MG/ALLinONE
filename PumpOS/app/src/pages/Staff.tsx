import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Users, Clock, Calendar, DollarSign, Search, Filter, Plus, Eye, Edit, MessageSquare, Trash2, Phone, Mail, MapPin, Clock4 } from "lucide-react";
import api from "@/utils/api";

interface KPIData {
  title: string;
  value: string;
  change: string;
  icon: string;
  trend: 'up' | 'down';
}

interface StaffMember {
  id: number;
  staff_id: string;
  name: string;
  role: string;
  department: string;
  status: 'active' | 'part-time' | 'on-leave' | 'inactive';
  hours_week: number;
  phone: string;
  email: string;
  join_date: string;
  certifications: string[];
  avatar: string;
}

interface Schedule {
  id: number;
  staff: string; // staff_id
  day: string;
  time: string;
  type: string;
}

interface Resource {
  id: number;
  name: string;
  type: string;
  status: 'available' | 'occupied' | 'maintenance';
  location: string;
  capacity?: string;
  maintenance?: string;
}

const Staff = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [messageDialog, setMessageDialog] = useState({ open: false, staff: null as StaffMember | null });
  const [newStaff, setNewStaff] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    hours_week: 40,
    certifications: [] as string[],
  });
  const [kpiData, setKpiData] = useState<KPIData[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const iconMap: { [key: string]: React.ComponentType<{ className: string }> } = {
    Users,
    Clock,
    Calendar,
    DollarSign,
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [kpiRes, staffRes, scheduleRes, resourceRes] = await Promise.all([
          api.get('/api/staff/kpi-summary/'),
          api.get(`/api/staff/staff/?search=${searchTerm}&department=${departmentFilter}`),
          api.get('/api/staff/schedules/'),
          api.get('/api/staff/resources/'),
        ]);
        setKpiData(Array.isArray(kpiRes.data) ? kpiRes.data : []);
        setStaffMembers(Array.isArray(staffRes.data.results) ? staffRes.data.results : []);
        setSchedules(Array.isArray(scheduleRes.data.results) ? scheduleRes.data.results : []);
        setResources(Array.isArray(resourceRes.data.results) ? resourceRes.data.results : []);
      } catch (error: any) {
        setError('Failed to fetch staff data.');
        toast({
          title: 'Error',
          description: 'Failed to fetch staff data. Please try again.',
          variant: 'destructive',
        });
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [searchTerm, departmentFilter, toast, navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'available':
        return 'bg-success text-success-foreground';
      case 'part-time':
        return 'bg-info text-info-foreground';
      case 'on-leave':
      case 'occupied':
        return 'bg-warning text-warning-foreground';
      case 'inactive':
      case 'maintenance':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || staff.department.toLowerCase().includes(departmentFilter);
    return matchesSearch && matchesDepartment;
  });

  const handleAddStaff = async () => {
    if (!newStaff.first_name || !newStaff.last_name || !newStaff.email || !newStaff.role) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await api.post('/api/staff/staff/', {
        staff_id: `STAFF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        first_name: newStaff.first_name,
        last_name: newStaff.last_name,
        email: newStaff.email,
        phone: newStaff.phone,
        role: newStaff.role,
        department: newStaff.department,
        hours_week: newStaff.hours_week,
        certifications: newStaff.certifications,
        join_date: new Date().toISOString().split('T')[0],
        avatar: '/placeholder.svg',
      },
    {headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }});
      toast({
        title: 'Success',
        description: `Staff member ${newStaff.first_name} ${newStaff.last_name} added successfully!`,
      });
      setNewStaff({ first_name: '', last_name: '', email: '', phone: '', role: '', department: '', hours_week: 40, certifications: [] });
      setIsAddDialogOpen(false);
      // Refresh staff list
      const staffRes = await api.get(`/api/staff/staff/?search=${searchTerm}&department=${departmentFilter}`);
      setStaffMembers(Array.isArray(staffRes.data) ? staffRes.data : []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to add staff member.',
        variant: 'destructive',
      });
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleSendMessage = async (message: string) => {
    toast({
      title: 'Message Sent',
      description: `Message sent to ${messageDialog.staff?.name}`,
    });
    setMessageDialog({ open: false, staff: null });
    // TODO: Implement actual message sending via API
  };

  const handleDeactivateStaff = async (staff: StaffMember) => {
    try {
      await api.patch(`/api/staff/staff/${staff.id}/`, { status: 'inactive' });
      toast({
        title: 'Staff Deactivated',
        description: `${staff.name} has been deactivated`,
        variant: 'destructive',
      });
      // Refresh staff list
      const staffRes = await api.get(`/api/staff/staff/?search=${searchTerm}&department=${departmentFilter}`);
      setStaffMembers(Array.isArray(staffRes.data) ? staffRes.data : []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to deactivate staff member.',
        variant: 'destructive',
      });
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header Section with Gradient Background */}
      <div className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-background rounded-xl border border-border/50 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Staff & Resources
            </h1>
            <p className="text-muted-foreground text-lg">Manage staff, schedules, and facility resources</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="shadow-sm hover:shadow-md transition-all">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-primary to-accent">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Staff
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Staff Member</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new staff member
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">First Name *</Label>
                      <Input
                        id="first_name"
                        value={newStaff.first_name}
                        onChange={(e) => setNewStaff({ ...newStaff, first_name: e.target.value })}
                        placeholder="First name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name *</Label>
                      <Input
                        id="last_name"
                        value={newStaff.last_name}
                        onChange={(e) => setNewStaff({ ...newStaff, last_name: e.target.value })}
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newStaff.email}
                        onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={newStaff.phone}
                        onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="role">Role *</Label>
                      <Input
                        id="role"
                        value={newStaff.role}
                        onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                        placeholder="Job title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Select onValueChange={(value) => setNewStaff({ ...newStaff, department: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Personal Training">Personal Training</SelectItem>
                          <SelectItem value="Group Classes">Group Classes</SelectItem>
                          <SelectItem value="Customer Service">Customer Service</SelectItem>
                          <SelectItem value="Facilities">Facilities</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hours">Hours/Week</Label>
                      <Input
                        id="hours"
                        type="number"
                        value={newStaff.hours_week}
                        onChange={(e) => setNewStaff({ ...newStaff, hours_week: parseInt(e.target.value) })}
                        min="1"
                        max="60"
                      />
                    </div>
                    <div>
                      <Label htmlFor="certifications">Certifications (comma-separated)</Label>
                      <Input
                        id="certifications"
                        value={newStaff.certifications.join(', ')}
                        onChange={(e) => setNewStaff({ ...newStaff, certifications: e.target.value.split(',').map(c => c.trim()).filter(c => c) })}
                        placeholder="e.g., NASM-CPT, First Aid"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddStaff}>Add Staff Member</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
          {error}
        </div>
      )}

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="text-center col-span-full text-muted-foreground">Loading KPIs...</div>
        ) : kpiData.map((kpi, index) => {
          const IconComponent = iconMap[kpi.icon];
          return (
            <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-foreground mb-2">{kpi.value}</div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="secondary"
                    className={`text-xs ${kpi.trend === 'up' ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}
                  >
                    {kpi.change}
                  </Badge>
                  <span className="text-xs text-muted-foreground">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="staff" className="space-y-8">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-3 h-12 bg-card shadow-lg border">
            <TabsTrigger value="staff" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Staff Management
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Schedules
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Resources
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="staff" className="space-y-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-card/50 to-card">
            <CardHeader className="pb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-semibold">Staff Directory</CardTitle>
                  <CardDescription className="text-base mt-2">Manage staff members and their information</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search staff..."
                      className="pl-10 w-full sm:w-64 shadow-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter} disabled={isLoading}>
                    <SelectTrigger className="w-full sm:w-40 shadow-sm">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="training">Personal Training</SelectItem>
                      <SelectItem value="classes">Group Classes</SelectItem>
                      <SelectItem value="service">Customer Service</SelectItem>
                      <SelectItem value="facilities">Facilities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              {/* Mobile Card View */}
              <div className="block lg:hidden px-6 space-y-4">
                {isLoading ? (
                  <div className="text-center text-muted-foreground">Loading staff...</div>
                ) : filteredStaff.length === 0 ? (
                  <div className="text-center text-muted-foreground">No staff found.</div>
                ) : (
                  filteredStaff.map((staff) => (
                    <Card key={staff.id} className="shadow-md hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={staff.avatar} />
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {staff.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-lg">{staff.name}</div>
                              <div className="text-sm text-muted-foreground">{staff.staff_id}</div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(staff.status)}>
                            {staff.status}
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <div className="font-medium text-primary">{staff.role}</div>
                            <div className="text-sm text-muted-foreground">{staff.department}</div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{staff.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{staff.phone}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <Clock4 className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{staff.hours_week}h/week</span>
                            </div>
                            <div className="flex gap-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" onClick={() => setSelectedStaff(staff)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Staff Profile</DialogTitle>
                                  </DialogHeader>
                                  {selectedStaff && (
                                    <div className="space-y-4">
                                      <div className="flex items-center space-x-4">
                                        <Avatar className="h-16 w-16">
                                          <AvatarImage src={selectedStaff.avatar} />
                                          <AvatarFallback className="bg-primary/10 text-primary text-xl">
                                            {selectedStaff.name.split(' ').map((n: string) => n[0]).join('')}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <h3 className="text-xl font-semibold">{selectedStaff.name}</h3>
                                          <p className="text-muted-foreground">{selectedStaff.role}</p>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <Label className="text-muted-foreground">Department</Label>
                                          <p>{selectedStaff.department}</p>
                                        </div>
                                        <div>
                                          <Label className="text-muted-foreground">Hours/Week</Label>
                                          <p>{selectedStaff.hours_week}h</p>
                                        </div>
                                        <div>
                                          <Label className="text-muted-foreground">Email</Label>
                                          <p>{selectedStaff.email}</p>
                                        </div>
                                        <div>
                                          <Label className="text-muted-foreground">Phone</Label>
                                          <p>{selectedStaff.phone}</p>
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">Certifications</Label>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                          {selectedStaff.certifications.map((cert: string, index: number) => (
                                            <Badge key={index} variant="outline">{cert}</Badge>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Dialog open={messageDialog.open} onOpenChange={(open) => setMessageDialog({ open, staff: open ? staff : null })}>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MessageSquare className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Send Message to {messageDialog.staff?.name}</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <Textarea placeholder="Type your message here..." rows={4} />
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setMessageDialog({ open: false, staff: null })}>
                                      Cancel
                                    </Button>
                                    <Button onClick={() => handleSendMessage("test message")}>
                                      Send Message
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeactivateStaff(staff)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="pt-2 border-t">
                            <div className="flex flex-wrap gap-1">
                              {staff.certifications.map((cert, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {cert}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Staff Member</TableHead>
                        <TableHead className="font-semibold">Role & Department</TableHead>
                        <TableHead className="font-semibold">Contact</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Hours/Week</TableHead>
                        <TableHead className="font-semibold">Certifications</TableHead>
                        <TableHead className="font-semibold text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground">
                            Loading staff...
                          </TableCell>
                        </TableRow>
                      ) : filteredStaff.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground">
                            No staff found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredStaff.map((staff) => (
                          <TableRow key={staff.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={staff.avatar} />
                                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                    {staff.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{staff.name}</div>
                                  <div className="text-sm text-muted-foreground">{staff.staff_id}</div>
                                </div>
                              </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium text-primary">{staff.role}</div>
                                  <div className="text-sm text-muted-foreground">{staff.department}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="text-sm flex items-center space-x-1">
                                    <Mail className="h-3 w-3 text-muted-foreground" />
                                    <span>{staff.email}</span>
                                  </div>
                                  <div className="text-sm text-muted-foreground flex items-center space-x-1">
                                    <Phone className="h-3 w-3" />
                                    <span>{staff.phone}</span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(staff.status)}>
                                  {staff.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium">{staff.hours_week}h</TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  {staff.certifications.slice(0, 2).map((cert, index) => (
                                    <Badge key={index} variant="outline" className="text-xs mr-1">
                                      {cert}
                                    </Badge>
                                  ))}
                                  {staff.certifications.length > 2 && (
                                    <div className="text-xs text-muted-foreground">
                                      +{staff.certifications.length - 2} more
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-center gap-1">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="ghost" size="sm" onClick={() => setSelectedStaff(staff)}>
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                      <DialogHeader>
                                        <DialogTitle>Staff Profile</DialogTitle>
                                      </DialogHeader>
                                      {selectedStaff && (
                                        <div className="space-y-4">
                                          <div className="flex items-center space-x-4">
                                            <Avatar className="h-16 w-16">
                                              <AvatarImage src={selectedStaff.avatar} />
                                              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                                                {selectedStaff.name.split(' ').map((n: string) => n[0]).join('')}
                                              </AvatarFallback>
                                            </Avatar>
                                            <div>
                                              <h3 className="text-xl font-semibold">{selectedStaff.name}</h3>
                                              <p className="text-muted-foreground">{selectedStaff.role}</p>
                                            </div>
                                          </div>
                                          <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                              <Label className="text-muted-foreground">Department</Label>
                                              <p>{selectedStaff.department}</p>
                                            </div>
                                            <div>
                                              <Label className="text-muted-foreground">Hours/Week</Label>
                                              <p>{selectedStaff.hours_week}h</p>
                                            </div>
                                            <div>
                                              <Label className="text-muted-foreground">Email</Label>
                                              <p>{selectedStaff.email}</p>
                                            </div>
                                            <div>
                                              <Label className="text-muted-foreground">Phone</Label>
                                              <p>{selectedStaff.phone}</p>
                                            </div>
                                          </div>
                                          <div>
                                            <Label className="text-muted-foreground">Certifications</Label>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                              {selectedStaff.certifications.map((cert: string, index: number) => (
                                                <Badge key={index} variant="outline">{cert}</Badge>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </DialogContent>
                                  </Dialog>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Dialog open={messageDialog.open} onOpenChange={(open) => setMessageDialog({ open, staff: open ? staff : null })}>
                                    <DialogTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MessageSquare className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Send Message to {messageDialog.staff?.name}</DialogTitle>
                                      </DialogHeader>
                                      <div className="space-y-4">
                                        <Textarea placeholder="Type your message here..." rows={4} />
                                      </div>
                                      <DialogFooter>
                                        <Button variant="outline" onClick={() => setMessageDialog({ open: false, staff: null })}>
                                          Cancel
                                        </Button>
                                        <Button onClick={() => handleSendMessage("test message")}>
                                          Send Message
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeactivateStaff(staff)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-card/50 to-card">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-semibold">Staff Schedules</CardTitle>
                  <CardDescription className="text-base mt-2">View and manage staff work schedules</CardDescription>
                </div>
                <Button className="shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-primary to-accent">
                  <Calendar className="h-4 w-4 mr-2" />
                  Create Schedule
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              {/* Mobile Schedule Cards */}
              <div className="block lg:hidden px-6 space-y-4">
                {isLoading ? (
                  <div className="text-center text-muted-foreground">Loading schedules...</div>
                ) : schedules.length === 0 ? (
                  <div className="text-center text-muted-foreground">No schedules found.</div>
                ) : (
                  schedules.map((schedule) => (
                    <Card key={schedule.id} className="shadow-md hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="font-semibold text-lg">{schedule.staff}</div>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                            {schedule.type}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="font-medium">{schedule.day}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock4 className="h-4 w-4 text-primary" />
                            <span>{schedule.time}</span>
                          </div>
                        </div>
                        <div className="flex justify-end mt-3">
                          <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Desktop Schedule Table */}
              <div className="hidden lg:block">
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Staff Member</TableHead>
                        <TableHead className="font-semibold">Day</TableHead>
                        <TableHead className="font-semibold">Time</TableHead>
                        <TableHead className="font-semibold">Type</TableHead>
                        <TableHead className="font-semibold text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground">
                            Loading schedules...
                          </TableCell>
                        </TableRow>
                      ) : schedules.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground">
                            No schedules found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        schedules.map((schedule) => (
                          <TableRow key={schedule.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell className="font-medium">{schedule.staff}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span>{schedule.day}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Clock4 className="h-4 w-4 text-primary" />
                                <span>{schedule.time}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                                {schedule.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center">
                                <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-card/50 to-card">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-semibold">Facility Resources</CardTitle>
                  <CardDescription className="text-base mt-2">Manage equipment, rooms, and facility resources</CardDescription>
                </div>
                <Button className="shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-primary to-accent">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Resource
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              {/* Mobile Resource Cards */}
              <div className="block lg:hidden px-6 space-y-4">
                {isLoading ? (
                  <div className="text-center text-muted-foreground">Loading resources...</div>
                ) : resources.length === 0 ? (
                  <div className="text-center text-muted-foreground">No resources found.</div>
                ) : (
                  resources.map((resource) => (
                    <Card key={resource.id} className="shadow-md hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="font-semibold text-lg">{resource.name}</div>
                            <div className="text-sm text-muted-foreground">{resource.type}</div>
                          </div>
                          <Badge className={getStatusColor(resource.status)}>
                            {resource.status}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{resource.location}</span>
                          </div>
                          <div className="text-muted-foreground">
                            {resource.capacity || resource.maintenance}
                          </div>
                        </div>
                        <div className="flex justify-end gap-1 mt-3">
                          <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Desktop Resource Table */}
              <div className="hidden lg:block">
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Resource Name</TableHead>
                        <TableHead className="font-semibold">Type</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Location</TableHead>
                        <TableHead className="font-semibold">Details</TableHead>
                        <TableHead className="font-semibold text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground">
                            Loading resources...
                          </TableCell>
                        </TableRow>
                      ) : resources.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground">
                            No resources found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        resources.map((resource) => (
                          <TableRow key={resource.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell className="font-medium">{resource.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-secondary/50">
                                {resource.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(resource.status)}>
                                {resource.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span>{resource.location}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {resource.capacity || resource.maintenance}
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center gap-1">
                                <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Staff;
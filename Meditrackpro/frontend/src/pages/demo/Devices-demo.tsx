import React, { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer-demo';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
  Stethoscope,
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  SlidersHorizontal,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  History,
  MoreHorizontal,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const deviceItems = [
  {
    id: 'DEV001',
    name: 'MRI Scanner',
    model: 'GE Healthcare Signa Explorer',
    status: 'Operational',
    condition: 'Excellent',
    lastCalibration: '2023-05-15',
    nextCalibration: '2023-11-15',
    location: 'Imaging Room 1',
    department: 'Radiology',
    maintenanceStatus: 'Up to date',
  },
  {
    id: 'DEV002',
    name: 'CT Scanner',
    model: 'Siemens Somatom Force',
    status: 'Operational',
    condition: 'Good',
    lastCalibration: '2023-04-28',
    nextCalibration: '2023-10-28',
    location: 'Imaging Room 2',
    department: 'Radiology',
    maintenanceStatus: 'Up to date',
  },
  {
    id: 'DEV003',
    name: 'Ultrasound Machine',
    model: 'Philips Affiniti 70',
    status: 'Needs Calibration',
    condition: 'Good',
    lastCalibration: '2023-01-10',
    nextCalibration: '2023-07-10',
    location: 'Examination Room 3',
    department: 'Obstetrics',
    maintenanceStatus: 'Calibration due',
  },
  {
    id: 'DEV004',
    name: 'Ventilator',
    model: 'Medtronic PB980',
    status: 'Under Maintenance',
    condition: 'Fair',
    lastCalibration: '2023-02-18',
    nextCalibration: '2023-08-18',
    location: 'ICU Room 4',
    department: 'Intensive Care',
    maintenanceStatus: 'Under repair',
  },
  {
    id: 'DEV005',
    name: 'ECG Machine',
    model: 'GE Healthcare MAC 5500',
    status: 'Operational',
    condition: 'Excellent',
    lastCalibration: '2023-05-22',
    nextCalibration: '2023-11-22',
    location: 'Cardiology Lab 1',
    department: 'Cardiology',
    maintenanceStatus: 'Up to date',
  },
  {
    id: 'DEV006',
    name: 'Infusion Pump',
    model: 'B. Braun Infusomat Space',
    status: 'Needs Calibration',
    condition: 'Good',
    lastCalibration: '2023-01-05',
    nextCalibration: '2023-07-05',
    location: 'General Ward 2',
    department: 'General Medicine',
    maintenanceStatus: 'Calibration due',
  },
  {
    id: 'DEV007',
    name: 'Anesthesia Machine',
    model: 'Dräger Perseus A500',
    status: 'Operational',
    condition: 'Good',
    lastCalibration: '2023-03-30',
    nextCalibration: '2023-09-30',
    location: 'Operating Room 3',
    department: 'Surgery',
    maintenanceStatus: 'Up to date',
  },
  {
    id: 'DEV008',
    name: 'X-Ray Machine',
    model: 'Siemens Multix Impact',
    status: 'Operational',
    condition: 'Good',
    lastCalibration: '2023-04-12',
    nextCalibration: '2023-10-12',
    location: 'Imaging Room 4',
    department: 'Radiology',
    maintenanceStatus: 'Up to date',
  },
];

// Sample maintenance logs
const maintenanceLogs = [
  {
    id: 'MLOG001',
    deviceId: 'DEV001',
    deviceName: 'MRI Scanner',
    date: '2023-05-15',
    type: 'Calibration',
    technician: 'John Smith',
    notes: 'Regular calibration performed. All systems functioning within parameters.',
    status: 'Completed',
  },
  {
    id: 'MLOG002',
    deviceId: 'DEV004',
    deviceName: 'Ventilator',
    date: '2023-06-10',
    type: 'Repair',
    technician: 'Sarah Johnson',
    notes: 'Flow sensor replaced. Additional testing required before returning to service.',
    status: 'In Progress',
  },
  {
    id: 'MLOG003',
    deviceId: 'DEV003',
    deviceName: 'Ultrasound Machine',
    date: '2023-01-10',
    type: 'Calibration',
    technician: 'Michael Brown',
    notes: 'Calibration completed. Image quality optimized.',
    status: 'Completed',
  },
  {
    id: 'MLOG004',
    deviceId: 'DEV002',
    deviceName: 'CT Scanner',
    date: '2023-04-28',
    type: 'Preventive Maintenance',
    technician: 'David Wilson',
    notes: 'Software updated to version 3.2.1. Hardware inspection completed with no issues found.',
    status: 'Completed',
  },
  {
    id: 'MLOG005',
    deviceId: 'DEV006',
    deviceName: 'Infusion Pump',
    date: '2023-01-05',
    type: 'Calibration',
    technician: 'Laura Martinez',
    notes: 'Flow rate calibrated to manufacturer specifications.',
    status: 'Completed',
  },
];

const Devicesdemo = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDevices, setFilteredDevices] = useState(deviceItems);
  const [devices, setDevices] = useState(deviceItems);
  const [editingDeviceId, setEditingDeviceId] = useState<string | null>(null);
  const [editCondition, setEditCondition] = useState<string>('');
  const [editStatus, setEditStatus] = useState<string>('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredDevices(devices);
    } else {
      const filtered = devices.filter(
        device => 
          device.name.toLowerCase().includes(query) || 
          device.id.toLowerCase().includes(query) ||
          device.model.toLowerCase().includes(query) ||
          device.department.toLowerCase().includes(query) ||
          device.location.toLowerCase().includes(query)
      );
      setFilteredDevices(filtered);
    }
  };

  const startEditing = (deviceId: string, currentCondition: string, currentStatus: string) => {
    setEditingDeviceId(deviceId);
    setEditCondition(currentCondition);
    setEditStatus(currentStatus);
  };

  const saveCondition = (deviceId: string) => {
    const updatedDevices = devices.map(device =>
      device.id === deviceId ? { ...device, condition: editCondition, status: editStatus } : device
    );
    
    setDevices(updatedDevices);
    setFilteredDevices(updatedDevices.filter(
      device => 
        device.name.toLowerCase().includes(searchQuery) || 
        device.id.toLowerCase().includes(searchQuery) ||
        device.model.toLowerCase().includes(searchQuery) ||
        device.department.toLowerCase().includes(searchQuery) ||
        device.location.toLowerCase().includes(searchQuery)
    ));
    setEditingDeviceId(null);
    toast({
      title: "Device Updated",
      description: `The condition and status for device ${deviceId} have been updated.`,
    });
  };

  const cancelEditing = () => {
    setEditingDeviceId(null);
    setEditCondition('');
    setEditStatus('');
  };

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medical Devices</h1>
          <p className="text-muted-foreground">Manage and track your medical device maintenance</p>
        </div>
        <div className="flex gap-3">
          <a href="/demo/devices/maintenance"><Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button></a>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <a href='/demo/devices/order'>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Device
            </Button>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <DashboardCard title="Total Devices" className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-100 dark:border-purple-800/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">128</div>
              <p className="text-sm text-muted-foreground">Registered devices</p>
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <Stethoscope size={24} />
            </div>
          </div>
        </DashboardCard>
        <DashboardCard
          title="Need Calibration"
          className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-100 dark:border-amber-800/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">12</div>
              <p className="text-sm text-muted-foreground">Due in next 30 days</p>
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <AlertTriangle size={24} />
            </div>
          </div>
        </DashboardCard>
        <DashboardCard
          title="Under Maintenance"
          className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-100 dark:border-red-800/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">5</div>
              <p className="text-sm text-muted-foreground">Currently servicing</p>
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
              <Stethoscope size={24} />
            </div>
          </div>
        </DashboardCard>
        <DashboardCard
          title="Calibration Compliance"
          className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800/30"
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="text-3xl font-bold">94%</div>
              <p className="text-sm text-muted-foreground">Devices up to date</p>
            </div>
            <div className="mt-2">
              <Progress value={94} className="h-2 bg-green-100 dark:bg-green-900/20" indicatorColor="bg-green-500" />
            </div>
          </div>
        </DashboardCard>
      </div>

      <Tabs defaultValue="devices" className="w-full mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="devices">All Devices</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance Logs</TabsTrigger>
          <TabsTrigger value="schedule">Calibration Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="devices" className="m-0">
          <DashboardCard title="Medical Devices">
            <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">
                  {filteredDevices.length} devices
                </Badge>
                <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400 mr-2">
                  {filteredDevices.filter(d => d.status === 'Operational').length} operational
                </Badge>
                <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400 mr-2">
                  {filteredDevices.filter(d => d.status === 'Needs Calibration').length} needs calibration
                </Badge>
                <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
                  {filteredDevices.filter(d => d.status === 'Under Maintenance').length} under maintenance
                </Badge>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search devices..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Device Name</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Next Calibration</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDevices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell className="font-medium">{device.id}</TableCell>
                      <TableCell>{device.name}</TableCell>
                      <TableCell>{device.model}</TableCell>
                      <TableCell>
                        {editingDeviceId === device.id ? (
                          <Select
                            value={editStatus}
                            onValueChange={setEditStatus}
                          >
                            <SelectTrigger className="w-[150px]">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Operational">Operational</SelectItem>
                              <SelectItem value="Needs Calibration">Needs Calibration</SelectItem>
                              <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge 
                            variant="outline" 
                            className={
                              device.status === 'Operational' 
                                ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400' 
                                : device.status === 'Needs Calibration'
                                ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
                                : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400'
                            }
                          >
                            {device.status}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{device.nextCalibration}</TableCell>
                      <TableCell>{device.location}</TableCell>
                      <TableCell>
                        {editingDeviceId === device.id ? (
                          <Select
                            value={editCondition}
                            onValueChange={setEditCondition}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Excellent">Excellent</SelectItem>
                              <SelectItem value="Good">Good</SelectItem>
                              <SelectItem value="Fair">Fair</SelectItem>
                              <SelectItem value="Poor">Poor</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          device.condition
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingDeviceId === device.id ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => saveCondition(device.id)}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={cancelEditing}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => navigate(`/demo/devices/${device.id}`)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/demo/devices/${device.id}/history`)}>
                                <History className="h-4 w-4 mr-2" />
                                View History
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => startEditing(device.id, device.condition, device.status)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate("/demo/devices/maintenance")}>
                                <Calendar className="h-4 w-4 mr-2" />
                                Schedule Maintenance
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => navigate("/demo/ticket-raise")}
                                className="text-orange-600"
                              >
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Report Issue
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DashboardCard>
        </TabsContent>
      </Tabs>
      
      <div className="text-center text-sm text-muted-foreground">
        Showing {filteredDevices.length} of {devices.length} devices
      </div>
    </PageContainer>
  );
};

export default Devicesdemo;
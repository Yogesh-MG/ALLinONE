import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/PageContainer';
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
import axios from 'axios';
import { baseUrl } from '@/utils/apiconfig';

// Define interfaces based on your backend serializers
interface Device {
  id: string;
  make_model: string;
  manufacture: string;
  serial_number: string;
  asset_number: string;
  is_active: string;
  next_calibration: string;
  Room: string;
  department: string;
  asset_details: string;
  service_logs: ServiceLog[];
  calibrations: Calibration[];
}

interface ServiceLog {
  id: string;
  device: string; // Device ID
  service_date: string;
  service_type: string;
  engineer: { name: string } | null;
  status: string;
}

interface Calibration {
  id: string;
  device: string; // Device ID
  next_calibration: string;
  engineer: { name: string } | null;
  status: string;
}

const Devices = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [editingDeviceId, setEditingDeviceId] = useState<string | null>(null);
  const [editCondition, setEditCondition] = useState('');
  const [editStatus, setEditStatus] = useState('');

  const hospitalId = localStorage.getItem('hospitalid');
  const instanceKey = localStorage.getItem('instance_key');
  const token = localStorage.getItem('token');

  const headers = { 
    Authorization: `Bearer ${token}`, 
    ...(instanceKey && { 'X-Instance-Key': instanceKey }) 
  };

  useEffect(() => {
    if (!token) {
      navigate('/');
      toast({ title: 'Unauthorized', description: 'Please log in.', variant: 'destructive' });
      return;
    }

    const fetchDevices = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/${hospitalId}/devices/`, { headers });
        setDevices(response.data);
        setFilteredDevices(response.data);
      } catch (error) {
        console.error('Fetch error:', error.response?.data);
        toast({ title: 'Error', description: 'Failed to fetch devices.', variant: 'destructive' });
      }
    };

    fetchDevices();
  }, [token, hospitalId, navigate, toast]);

  const totalDevices = devices.length;
  const underMaintenance = devices.filter(device => !device.is_active).length;
  const currentDate = new Date(); // Adjust as needed
  const thirtyDaysFromNow = new Date(currentDate);
  thirtyDaysFromNow.setDate(currentDate.getDate() + 30);

  const needCalibration = devices.filter(device => {
    if (!device.next_calibration) return false;
    const nextCalDate = new Date(device.next_calibration);
    return nextCalDate <= thirtyDaysFromNow && nextCalDate >= currentDate;
  }).length;

  const calibrationCompliance = totalDevices > 0 
    ? Math.round(((totalDevices - needCalibration) / totalDevices) * 100) 
    : 0;

  const handleDelete = async (deviceId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this device?");
    if (!confirmDelete) return;
    
    try {
      await axios.delete(`${baseUrl}/api/${hospitalId}/devices/${deviceId}/`, { headers });
      const updatedDevices = devices.filter(device => device.id !== deviceId);
      setDevices(updatedDevices);
      setFilteredDevices(updatedDevices.filter(device => matchesSearch(device, searchQuery)));
      toast({ title: "Success", description: "Device deleted successfully." });
    } catch (error) {
      console.error("Delete error:", error.response?.data);
      toast({ title: "Error", description: "Failed to delete device.", variant: "destructive" });
    }
  };

  const matchesSearch = (device: Device, query: string) => {
    query = query.toLowerCase();
    return (
      device.make_model.toLowerCase().includes(query) ||
      device.serial_number.toLowerCase().includes(query) ||
      device.manufacture.toLowerCase().includes(query) ||
      (device.department?.toLowerCase().includes(query) || false) ||
      (device.Room?.toLowerCase().includes(query) || false)
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredDevices(devices);
    } else {
      const filtered = devices.filter(device => matchesSearch(device, query));
      setFilteredDevices(filtered);
    }
  };

  const startEditing = (deviceId: string, currentCondition: string, currentStatus: string) => {
    const mappedCondition = mapDeviceCondition(currentCondition);
    setEditingDeviceId(deviceId);
    setEditCondition(mappedCondition);
    setEditStatus(currentStatus || 'Operational');
  };

  const saveCondition = async (deviceId: string) => {
    try {
      const updatedDevice = { 
        asset_details: editCondition,
        is_active: editStatus.replace(' ', '_'),
      };
      await axios.patch(`${baseUrl}/api/${hospitalId}/devices/${deviceId}/`, updatedDevice, { headers });
      const updatedDevices = devices.map(device =>
        device.id === deviceId ? { ...device, asset_details: editCondition, is_active: editStatus.replace(' ', '_') } : device
      );
      setDevices(updatedDevices);
      setFilteredDevices(updatedDevices.filter(device => matchesSearch(device, searchQuery)));
      setEditingDeviceId(null);
      toast({ title: 'Device Updated', description: `Device ${deviceId} updated successfully.` });
    } catch (error) {
      console.error('Update error:', error.response?.data);
      toast({ title: 'Error', description: `Failed to update device.`, variant: 'destructive' });
    }
  };

  const cancelEditing = () => {
    setEditingDeviceId(null);
    setEditCondition('');
    setEditStatus('');
  };

  const mapDeviceStatus = (isActive: string) => isActive.replace('_', ' ');
  const mapDeviceCondition = (details: string) => (details?.toLowerCase().includes('poor') ? 'Poor' : 'Excellent');

  // Get latest calibration per device
  const getLatestCalibrations = () => {
    const latestCals: Calibration[] = [];
    devices.forEach(device => {
      if (device.calibrations && device.calibrations.length > 0) {
        const latest = device.calibrations.reduce((prev, curr) => 
          parseInt(curr.id) > parseInt(prev.id) ? curr : prev
        );
        if (latest.status !== "completed") {
          latestCals.push({ ...latest, device: device.id }); // Ensure device ID is preserved
        }
      }
    });
    return latestCals;
  };

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medical Devices</h1>
          <p className="text-muted-foreground">Manage and track your medical device maintenance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
          </Button>
          <a href="/devices/order">
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
              <div className="text-3xl font-bold">{totalDevices}</div>
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
              <div className="text-3xl font-bold">{needCalibration}</div>
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
              <div className="text-3xl font-bold">{underMaintenance}</div>
              <p className="text-sm text-muted-foreground">Currently servicing</p>
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
              <Stethoscope size={24} />
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
                <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400 mr-2">
                  {filteredDevices.filter(d => mapDeviceStatus(d.is_active) === 'Operational').length} operational
                </Badge>
                <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400 mr-2">
                  {filteredDevices.filter(d => mapDeviceStatus(d.is_active) === 'Needs Calibration').length} needs calibration
                </Badge>
                <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
                  {filteredDevices.filter(d => mapDeviceStatus(d.is_active) === 'Under Maintenance').length} under maintenance
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
                {/*<Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>*/}
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
                      <TableCell className="font-medium">{device.serial_number}</TableCell>
                      <TableCell>{device.make_model}</TableCell>
                      <TableCell>{device.manufacture}</TableCell>
                      <TableCell>
                        {editingDeviceId === device.id ? (
                          <Select value={editStatus} onValueChange={setEditStatus}>
                            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Operational">Operational</SelectItem>
                              <SelectItem value="Needs_Calibration">Needs Calibration</SelectItem>
                              <SelectItem value="Under_Maintenance">Under Maintenance</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge 
                            variant="outline" 
                            className={mapDeviceStatus(device.is_active) === 'Operational' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}
                          >
                            {mapDeviceStatus(device.is_active)}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{device.next_calibration ? new Date(device.next_calibration).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell>{device.Room || 'N/A'}</TableCell>
                      <TableCell>
                        {editingDeviceId === device.id ? (
                          <Select value={editCondition} onValueChange={setEditCondition}>
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Excellent">Excellent</SelectItem>
                              <SelectItem value="Poor">Poor</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          mapDeviceCondition(device.asset_details)
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingDeviceId === device.id ? (
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => saveCondition(device.id)}><CheckCircle2 className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={cancelEditing}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => navigate(`/devices/${device.id}`)}>
                                <Eye className="h-4 w-4 mr-2" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(device.id)} className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => startEditing(device.id, mapDeviceCondition(device.asset_details), mapDeviceStatus(device.is_active))}>
                                <Edit className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate("/ticket-raise")} className="text-orange-600">
                                <AlertTriangle className="h-4 w-4 mr-2" /> Report Issue
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

        <TabsContent value="maintenance" className="m-0">
          <DashboardCard title="Maintenance Logs">
            <p className="text-muted-foreground mb-4">Click a device to view details or schedule maintenance.</p>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Service Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Engineer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devices.flatMap(device => 
                    device.service_logs.filter(log => log.status !== "completed")
                  ).map(log => {
                    const device = devices.find(d => d.id === log.device);
                    return (
                      <TableRow 
                        key={log.id} 
                        className="cursor-pointer hover:bg-muted"
                      >
                        <TableCell className="font-medium">{device?.serial_number || 'N/A'}</TableCell>
                        <TableCell>{device ? `${device.make_model} (${device.asset_number})` : 'N/A'}</TableCell>
                        <TableCell>{log.service_date ? new Date(log.service_date).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell>{log.service_type || 'N/A'}</TableCell>
                        <TableCell>{log.engineer?.name || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={log.status === 'scheduled' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-red-200 bg-red-50 text-red-700'}
                          >
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => navigate(`/devices/${log.device}`)}>
                                <Eye className="h-4 w-4 mr-2" /> View Device
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </DashboardCard>
        </TabsContent>

        <TabsContent value="schedule" className="m-0">
          <DashboardCard title="Calibration Schedule">
            <p className="text-muted-foreground mb-4">Click a device to view details or schedule calibration.</p>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Next Calibration</TableHead>
                    <TableHead>Engineer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getLatestCalibrations().map(cal => {
                    const device = devices.find(d => d.id === cal.device);
                    return (
                      <TableRow 
                        key={cal.id} 
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => navigate(`/devices/${cal.device}`)}
                      >
                        <TableCell className="font-medium">{device?.serial_number || 'N/A'}</TableCell>
                        <TableCell>{device ? `${device.make_model} (${device.asset_number})` : 'N/A'}</TableCell>
                        <TableCell>{cal.next_calibration ? new Date(cal.next_calibration).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell>{cal.engineer?.name || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={cal.status === 'scheduled' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-red-200 bg-red-50 text-red-700'}
                          >
                            {cal.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/devices/${cal.device}`); }}>
                                <Eye className="h-4 w-4 mr-2" /> View Device
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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

export default Devices;
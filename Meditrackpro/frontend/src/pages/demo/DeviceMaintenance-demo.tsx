import React, { useState } from "react";
import PageContainer from "@/components/layout/PageContainer-demo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Search, Calendar as CalendarIcon, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface MaintenanceTask {
  id: string;
  deviceId: string;
  deviceName: string;
  scheduledDate: Date;
  type: string;
  assignedTo: string;
  status: "scheduled" | "completed" | "overdue";
  notes?: string;
}

const DeviceMaintenancedemo = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([
    {
      id: "1",
      deviceId: "1",
      deviceName: "Defibrillator - HeartStart MRx",
      scheduledDate: new Date(2024, 5, 15),
      type: "Calibration",
      assignedTo: "John Smith",
      status: "scheduled",
      notes: "Monthly calibration check required"
    },
    {
      id: "2",
      deviceId: "3",
      deviceName: "Infusion Pump - Alaris GH",
      scheduledDate: new Date(2024, 4, 18),
      type: "Repair",
      assignedTo: "Michael Wong",
      status: "scheduled",
      notes: "Flow rate issue reported by nurses"
    },
    {
      id: "3",
      deviceId: "2",
      deviceName: "Ventilator - Servo-u",
      scheduledDate: new Date(2024, 6, 22),
      type: "Preventive",
      assignedTo: "Sarah Johnson",
      status: "scheduled",
      notes: "Regular 3-month preventive maintenance"
    }
  ]);

  const [newTask, setNewTask] = useState({
    deviceId: "",
    deviceName: "",
    scheduledDate: new Date(),
    type: "",
    assignedTo: "",
    notes: ""
  });

  const devices = [
    { id: "1", name: "Defibrillator - HeartStart MRx" },
    { id: "2", name: "Ventilator - Servo-u" },
    { id: "3", name: "Infusion Pump - Alaris GH" },
    { id: "4", name: "Ultrasound Machine - LOGIQ E9" }
  ];

  const technicians = [
    { id: "1", name: "John Smith" },
    { id: "2", name: "Sarah Johnson" },
    { id: "3", name: "Michael Wong" },
    { id: "4", name: "Emily Chen" }
  ];

  const handleAddTask = () => {
    if (!newTask.deviceId || !newTask.type || !newTask.assignedTo) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const task: MaintenanceTask = {
      id: Date.now().toString(),
      deviceId: newTask.deviceId,
      deviceName: devices.find(d => d.id === newTask.deviceId)?.name || "",
      scheduledDate: newTask.scheduledDate,
      type: newTask.type,
      assignedTo: newTask.assignedTo,
      status: "scheduled",
      notes: newTask.notes
    };

    setMaintenanceTasks([...maintenanceTasks, task]);
    setNewTask({
      deviceId: "",
      deviceName: "",
      scheduledDate: new Date(),
      type: "",
      assignedTo: "",
      notes: ""
    });

    toast({
      title: "Maintenance Scheduled",
      description: "The maintenance task has been scheduled successfully."
    });
  };

  const getStatusBadge = (status: MaintenanceTask["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Scheduled</Badge>;
    }
  };

  const completeTask = (id: string) => {
    setMaintenanceTasks(
      maintenanceTasks.map(task =>
        task.id === id ? { ...task, status: "completed" } : task
      )
    );
    toast({
      title: "Task Completed",
      description: "The maintenance task has been marked as completed."
    });
  };

  const exportSchedule = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Device,Date,Type,Assigned To,Status,Notes\n"
      + maintenanceTasks.map(task => 
          `${task.deviceName},${format(task.scheduledDate, "yyyy-MM-dd")},${task.type},${task.assignedTo},${task.status},${task.notes || ""}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `maintenance-schedule-${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: "Maintenance schedule has been exported."
    });
  };

  const viewTask = (task: MaintenanceTask) => {
    setSelectedTask(task);
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Device Maintenance Schedule</h1>
            <p className="text-muted-foreground">
              Schedule and track maintenance for your medical devices
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex gap-2" onClick={exportSchedule}>
              <Download size={16} />
              Export Schedule
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Maintenance Tasks</CardTitle>
              <CardDescription>View and manage scheduled maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search maintenance tasks..." className="pl-8" />
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maintenanceTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.deviceName}</TableCell>
                      <TableCell>{format(task.scheduledDate, "MMMM d, yyyy")}</TableCell>
                      <TableCell>{task.type}</TableCell>
                      <TableCell>{task.assignedTo}</TableCell>
                      <TableCell>{getStatusBadge(task.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {task.status !== "completed" && (
                            <Button size="sm" onClick={() => completeTask(task.id)}>Complete</Button>
                          )}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => viewTask(task)}>View</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Maintenance Task Details</DialogTitle>
                                <DialogDescription>Task ID: {task.id}</DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">Device:</Label>
                                  <span className="col-span-3">{task.deviceName}</span>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">Date:</Label>
                                  <span className="col-span-3">{format(task.scheduledDate, "MMMM d, yyyy")}</span>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">Type:</Label>
                                  <span className="col-span-3">{task.type}</span>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">Assigned To:</Label>
                                  <span className="col-span-3">{task.assignedTo}</span>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">Status:</Label>
                                  <span className="col-span-3">{getStatusBadge(task.status)}</span>
                                </div>
                                {task.notes && (
                                  <div className="grid grid-cols-4 items-start gap-4">
                                    <Label className="text-right">Notes:</Label>
                                    <span className="col-span-3">{task.notes}</span>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schedule Maintenance</CardTitle>
              <CardDescription>Create a new maintenance task</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="device">Device</Label>
                  <Select 
                    value={newTask.deviceId} 
                    onValueChange={(value) => setNewTask({...newTask, deviceId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select device" />
                    </SelectTrigger>
                    <SelectContent>
                      {devices.map(device => (
                        <SelectItem key={device.id} value={device.id}>{device.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Scheduled Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newTask.scheduledDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newTask.scheduledDate ? format(newTask.scheduledDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newTask.scheduledDate}
                        onSelect={(date) => date && setNewTask({...newTask, scheduledDate: date})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Maintenance Type</Label>
                  <Select 
                    value={newTask.type} 
                    onValueChange={(value) => setNewTask({...newTask, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Preventive">Preventive</SelectItem>
                      <SelectItem value="Calibration">Calibration</SelectItem>
                      <SelectItem value="Repair">Repair</SelectItem>
                      <SelectItem value="Inspection">Inspection</SelectItem>
                      <SelectItem value="Software Update">Software Update</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="technician">Assign To</Label>
                  <Select 
                    value={newTask.assignedTo} 
                    onValueChange={(value) => setNewTask({...newTask, assignedTo: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select technician" />
                    </SelectTrigger>
                    <SelectContent>
                      {technicians.map(tech => (
                        <SelectItem key={tech.id} value={tech.name}>{tech.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Add any additional notes or instructions" 
                    value={newTask.notes}
                    onChange={(e) => setNewTask({...newTask, notes: e.target.value})}
                  />
                </div>

                <Button type="button" className="w-full" onClick={handleAddTask}>
                  Schedule Maintenance
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default DeviceMaintenancedemo;
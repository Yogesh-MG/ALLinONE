import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PageContainer from "@/components/layout/PageContainer-demo";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Calendar, 
  ClipboardList, 
  Clock, 
  Download, 
  FileText, 
  History, 
  MessageSquare, 
  Ticket, 
  Wrench, 
  Upload
} from "lucide-react";

const getDeviceData = (id: string) => {
  const devices = [
    {
      id: "DEV001",
      name: "Defibrillator",
      model: "HeartStart MRx",
      manufacturer: "Philips",
      status: "Active",
      usage: 90,
      serial: "PHI-35792468",
      purchaseDate: "2022-03-15",
      warrantyUntil: "2025-03-15",
      location: "ICU, Floor 3",
      department: "Emergency",
      nextMaintenance: "2024-06-15",
      maintenanceHistory: [
        { date: "2023-12-10", type: "Preventive", technician: "John Smith", notes: "Battery replaced, all systems nominal" },
        { date: "2023-08-05", type: "Calibration", technician: "Emily Johnson", notes: "Recalibrated shock delivery system" },
        { date: "2023-03-22", type: "Repair", technician: "Michael Brown", notes: "Fixed display malfunction" }
      ],
      specifications: {
        powerSupply: "AC 100-240V, 50/60Hz",
        batteryType: "Lithium Ion",
        batteryLife: "5 hours",
        weight: "6.7 kg",
        dimensions: "31.5 × 21.0 × 29.5 cm",
        connectivityOptions: "Bluetooth, Wi-Fi",
        certifications: "FDA, CE, ISO 13485"
      },
      documents: [
        { name: "User Manual", type: "PDF", size: "2.4 MB", lastUpdated: "2022-04-10" },
        { name: "Service Guide", type: "PDF", size: "3.8 MB", lastUpdated: "2022-05-15" },
        { name: "Calibration Certificate", type: "PDF", size: "1.1 MB", lastUpdated: "2023-08-05" }
      ],
      usageStats: {
        totalUses: 142,
        averageMonthlyUses: 8,
        lastUsed: "2024-04-28",
        uptime: 99.7,
        alerts: 3
      }
    },
    {
      id: "DEV002",
      name: "Ventilator",
      model: "Servo-u",
      manufacturer: "Getinge",
      status: "Active",
      usage: 75,
      serial: "GET-46813579",
      purchaseDate: "2021-07-22",
      warrantyUntil: "2024-07-22",
      location: "CCU, Floor 2",
      department: "Pulmonology",
      nextMaintenance: "2024-07-22",
      maintenanceHistory: [
        { date: "2024-01-15", type: "Preventive", technician: "Sarah Wilson", notes: "Air filters replaced, flow sensors calibrated" },
        { date: "2023-07-08", type: "Software Update", technician: "Robert Davis", notes: "Updated to firmware v4.2.1" },
        { date: "2022-12-03", type: "Repair", technician: "Jennifer Miller", notes: "Replaced malfunctioning display panel" }
      ],
      specifications: {
        powerSupply: "AC 100-240V, 50/60Hz",
        batteryType: "Lithium Ion",
        batteryLife: "3 hours",
        weight: "15 kg",
        dimensions: "35.0 × 30.0 × 40.0 cm",
        connectivityOptions: "Ethernet, Wi-Fi",
        certifications: "FDA, CE, ISO 13485"
      },
      documents: [
        { name: "User Manual", type: "PDF", size: "3.6 MB", lastUpdated: "2021-08-10" },
        { name: "Service Guide", type: "PDF", size: "4.2 MB", lastUpdated: "2022-02-15" },
        { name: "Technical Specifications", type: "PDF", size: "1.8 MB", lastUpdated: "2021-07-30" }
      ],
      usageStats: {
        totalUses: 312,
        averageMonthlyUses: 12,
        lastUsed: "2024-04-30",
        uptime: 98.5,
        alerts: 7
      }
    },
    {
      id: "DEV003",
      name: "Infusion Pump",
      model: "Alaris GH",
      manufacturer: "BD",
      status: "Maintenance",
      usage: 30,
      serial: "BD-24681357",
      purchaseDate: "2022-09-10",
      warrantyUntil: "2025-09-10",
      location: "Pharmacy Storage",
      department: "Pharmacy",
      nextMaintenance: "2024-05-18",
      maintenanceHistory: [
        { date: "2023-11-20", type: "Preventive", technician: "Thomas Anderson", notes: "Pressure sensors calibrated" },
        { date: "2023-05-12", type: "Software Update", technician: "Lisa Taylor", notes: "Updated drug library" },
        { date: "2022-12-30", type: "Repair", technician: "David Wilson", notes: "Fixed occlusion alarm issues" }
      ],
      specifications: {
        powerSupply: "AC 100-240V, 50/60Hz",
        batteryType: "Lithium Polymer",
        batteryLife: "8 hours",
        weight: "2.5 kg",
        dimensions: "15.0 × 20.0 × 25.0 cm",
        connectivityOptions: "Wi-Fi, RFID",
        certifications: "FDA, CE, ISO 13485"
      },
      documents: [
        { name: "User Manual", type: "PDF", size: "1.9 MB", lastUpdated: "2022-09-15" },
        { name: "Drug Library", type: "XLSX", size: "3.2 MB", lastUpdated: "2023-05-12" },
        { name: "Quick Start Guide", type: "PDF", size: "0.8 MB", lastUpdated: "2022-09-20" }
      ],
      usageStats: {
        totalUses: 208,
        averageMonthlyUses: 14,
        lastUsed: "2024-04-15",
        uptime: 97.8,
        alerts: 12
      }
    },
    {
      id: "4",
      name: "Ultrasound Machine",
      model: "LOGIQ E9",
      manufacturer: "GE Healthcare",
      status: "Active",
      usage: 60,
      serial: "GE-13579246",
      purchaseDate: "2021-05-05",
      warrantyUntil: "2024-05-05",
      location: "Radiology, Floor 1",
      department: "Radiology",
      nextMaintenance: "2024-08-05",
      maintenanceHistory: [
        { date: "2023-10-10", type: "Preventive", technician: "Amy Chen", notes: "Transducers checked, system diagnostics run" },
        { date: "2023-02-15", type: "Software Update", technician: "James Wilson", notes: "Updated to software version 2.5" },
        { date: "2022-07-08", type: "Repair", technician: "Kevin Martin", notes: "Replaced faulty cooling fan" }
      ],
      specifications: {
        powerSupply: "AC 200-240V, 50/60Hz",
        batteryType: "None (requires constant power)",
        weight: "83 kg",
        dimensions: "56.0 × 82.0 × 142.0 cm",
        connectivityOptions: "DICOM, Ethernet, USB",
        certifications: "FDA, CE, ISO 13485"
      },
      documents: [
        { name: "User Manual", type: "PDF", size: "5.2 MB", lastUpdated: "2021-06-10" },
        { name: "Service Guide", type: "PDF", size: "6.8 MB", lastUpdated: "2022-01-20" },
        { name: "DICOM Conformance Statement", type: "PDF", size: "2.5 MB", lastUpdated: "2021-05-15" }
      ],
      usageStats: {
        totalUses: 418,
        averageMonthlyUses: 15,
        lastUsed: "2024-04-29",
        uptime: 99.2,
        alerts: 5
      }
    }
  ];
  
  return devices.find(device => device.id === id);
};

const DeviceDetaildemo = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  const device = getDeviceData(id || "");
  
  if (!device) {
    return (
      <PageContainer title="Device Not Found" subtitle="The requested device could not be found">
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <p className="text-muted-foreground text-center">
            The device with ID {id} could not be found or may have been removed.
          </p>
          <Button onClick={() => navigate("/devices")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Devices
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/devices")}
            className="mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{device.name}</h1>
            <p className="text-muted-foreground">
              {device.model} • {device.manufacturer} • ID: {device.id}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                device.status === "Active" ? "text-green-500" : 
                device.status === "Maintenance" ? "text-amber-500" : 
                "text-red-500"
              }`}>
                {device.status}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Progress value={device.usage} className="h-2" />
                <span className="text-2xl font-bold">{device.usage}%</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{device.location}</div>
              <div className="text-muted-foreground">{device.department}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Next Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Date(device.nextMaintenance).toLocaleDateString()}</div>
              <div className="text-muted-foreground">
                {new Date(device.nextMaintenance) > new Date() 
                  ? `In ${Math.ceil((new Date(device.nextMaintenance).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days` 
                  : 'Overdue'}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start mb-6 overflow-x-auto flex-nowrap">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="specifications" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Specifications
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Maintenance History
            </TabsTrigger>
            <TabsTrigger value="documentation" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Documentation
            </TabsTrigger>
            <TabsTrigger value="usage" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Usage Statistics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Device Information</CardTitle>
                <CardDescription>
                  Detailed information about this {device.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-muted-foreground mb-2">General Information</h3>
                      <dl className="grid grid-cols-2 gap-2">
                        <dt className="text-muted-foreground">Model:</dt>
                        <dd className="font-medium">{device.model}</dd>
                        
                        <dt className="text-muted-foreground">Manufacturer:</dt>
                        <dd className="font-medium">{device.manufacturer}</dd>
                        
                        <dt className="text-muted-foreground">Serial Number:</dt>
                        <dd className="font-medium">{device.serial}</dd>
                      </dl>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-muted-foreground mb-2">Location</h3>
                      <dl className="grid grid-cols-2 gap-2">
                        <dt className="text-muted-foreground">Department:</dt>
                        <dd className="font-medium">{device.department}</dd>
                        
                        <dt className="text-muted-foreground">Room/Area:</dt>
                        <dd className="font-medium">{device.location}</dd>
                      </dl>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-muted-foreground mb-2">Purchase Information</h3>
                      <dl className="grid grid-cols-2 gap-2">
                        <dt className="text-muted-foreground">Purchase Date:</dt>
                        <dd className="font-medium">{new Date(device.purchaseDate).toLocaleDateString()}</dd>
                        
                        <dt className="text-muted-foreground">Warranty Until:</dt>
                        <dd className="font-medium">{new Date(device.warrantyUntil).toLocaleDateString()}</dd>
                      </dl>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-muted-foreground mb-2">Status</h3>
                      <dl className="grid grid-cols-2 gap-2">
                        <dt className="text-muted-foreground">Current Status:</dt>
                        <dd className={`font-medium ${
                          device.status === "Active" ? "text-green-500" : 
                          device.status === "Maintenance" ? "text-amber-500" : 
                          "text-red-500"
                        }`}>{device.status}</dd>
                        
                        <dt className="text-muted-foreground">Next Maintenance:</dt>
                        <dd className="font-medium">{new Date(device.nextMaintenance).toLocaleDateString()}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="flex gap-2" onClick={() => navigate("/devices/maintenance")}>
                  <Calendar size={16} />
                  Schedule Maintenance
                </Button>
                <Button 
                  variant="outline" 
                  className="flex gap-2" 
                  onClick={() => navigate("/ticket-raise", { state: { deviceId: device.id, deviceName: device.name }})}
                >
                  <Ticket size={16} />
                  Report Issue
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="specifications" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
                <CardDescription>
                  Technical details and specifications for this {device.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Specification</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(device.specifications).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</TableCell>
                          <TableCell>{value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {device.specifications.certifications.split(', ').map((cert) => (
                        <div key={cert} className="bg-muted rounded-full px-3 py-1 text-sm">
                          {cert}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => navigate("/devices/maintenance")}>
                  <Wrench className="mr-2 h-4 w-4" />
                  Request Calibration
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="maintenance" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance History</CardTitle>
                <CardDescription>
                  Record of maintenance activities for this {device.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Technician</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {device.maintenanceHistory.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              record.type === 'Preventive' ? 'bg-green-100 text-green-800' :
                              record.type === 'Repair' ? 'bg-red-100 text-red-800' :
                              record.type === 'Calibration' ? 'bg-blue-100 text-blue-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {record.type}
                            </span>
                          </TableCell>
                          <TableCell>{record.technician}</TableCell>
                          <TableCell>{record.notes}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="flex gap-2" onClick={() => navigate("/devices/maintenance")}>
                  <Calendar size={16} />
                  Schedule Maintenance
                </Button>
                <Button variant="default">
                  <Upload className="mr-2 h-4 w-4" />
                  Add Maintenance Record
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="documentation" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Documentation</CardTitle>
                <CardDescription>
                  Available documentation for this {device.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Document</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {device.documents.map((doc, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{doc.name}</TableCell>
                          <TableCell>{doc.type}</TableCell>
                          <TableCell>{doc.size}</TableCell>
                          <TableCell>{new Date(doc.lastUpdated).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Document
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="usage" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
                <CardDescription>
                  Usage data and performance metrics for this {device.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-muted-foreground mb-2">Usage Metrics</h3>
                      <dl className="grid grid-cols-2 gap-3">
                        <dt className="text-muted-foreground">Total Uses:</dt>
                        <dd className="font-medium">{device.usageStats.totalUses}</dd>
                        
                        <dt className="text-muted-foreground">Monthly Average:</dt>
                        <dd className="font-medium">{device.usageStats.averageMonthlyUses} uses</dd>
                        
                        <dt className="text-muted-foreground">Last Used:</dt>
                        <dd className="font-medium">{new Date(device.usageStats.lastUsed).toLocaleDateString()}</dd>
                      </dl>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-muted-foreground mb-2">Performance</h3>
                      <dl className="grid grid-cols-2 gap-3">
                        <dt className="text-muted-foreground">Uptime:</dt>
                        <dd className="font-medium">{device.usageStats.uptime}%</dd>
                        
                        <dt className="text-muted-foreground">Alerts/Warnings:</dt>
                        <dd className="font-medium">{device.usageStats.alerts} in past 30 days</dd>
                      </dl>
                    </div>
                  </div>
                  
                  <Card className="border bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Usage Over Time</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-[200px]">
                      <div className="text-center text-muted-foreground">
                        <Clock className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p>Detailed usage charts would appear here</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Usage Data
                </Button>
                <Button variant="outline" className="flex gap-2" onClick={() => navigate("/analytics")}>
                  <MessageSquare className="h-4 w-4" />
                  Request Analysis
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default DeviceDetaildemo;

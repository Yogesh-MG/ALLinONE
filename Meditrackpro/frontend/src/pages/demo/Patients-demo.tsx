
import React from "react";
import { FilterX, Plus, Search, UserPlus, Users } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer-demo";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Patientsdemo = () => {
  // Sample patient data
  const patients = [
    { 
      id: "P001", 
      name: "John Smith", 
      age: 45, 
      gender: "Male", 
      phone: "(555) 123-4567", 
      lastVisit: "2024-03-01", 
      status: "Active" 
    },
    { 
      id: "P002", 
      name: "Sarah Johnson", 
      age: 32, 
      gender: "Female", 
      phone: "(555) 987-6543", 
      lastVisit: "2024-02-15", 
      status: "Active" 
    },
    { 
      id: "P003", 
      name: "Robert Williams", 
      age: 58, 
      gender: "Male", 
      phone: "(555) 456-7890", 
      lastVisit: "2024-01-20", 
      status: "Inactive" 
    },
    { 
      id: "P004", 
      name: "Maria Garcia", 
      age: 27, 
      gender: "Female", 
      phone: "(555) 234-5678", 
      lastVisit: "2024-03-10", 
      status: "Active" 
    },
    { 
      id: "P005", 
      name: "David Lee", 
      age: 41, 
      gender: "Male", 
      phone: "(555) 876-5432", 
      lastVisit: "2024-02-28", 
      status: "Active" 
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
      case "Inactive":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Patient Management</h1>
            <p className="text-muted-foreground">
              Manage patient records, prescriptions, and appointments
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex gap-2">
              <FilterX size={16} />
              Filter
            </Button>
           <a href="/patients/add">
            <Button className="flex gap-2">
              <UserPlus size={16} />
              Add Patient
            </Button>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DashboardCard title="Total Patients" description="Registered patients">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">1,248</span>
              <Badge className="bg-green-50 text-green-700 border-green-200">+24</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">24 new patients this month</p>
          </DashboardCard>
          
          <DashboardCard title="Active Patients" description="Recent visits">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">876</span>
              <span className="ml-2 text-sm text-muted-foreground">visited in last 6 months</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">70% active patient rate</p>
          </DashboardCard>
          
          <DashboardCard title="Appointments" description="Scheduled today">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">18</span>
              <span className="ml-2 text-sm text-muted-foreground">appointments today</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="text-sm">
                <span className="text-green-600 font-medium">12</span> Confirmed
              </div>
              <div className="text-sm">
                <span className="text-yellow-600 font-medium">4</span> Pending
              </div>
              <div className="text-sm">
                <span className="text-red-600 font-medium">2</span> Canceled
              </div>
            </div>
          </DashboardCard>
        </div>

        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <TabsList>
                  <TabsTrigger value="all">All Patients</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
                </TabsList>
                
                <div className="relative w-full sm:w-auto min-w-[200px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search patients..." 
                    className="pl-8" 
                  />
                </div>
              </div>
              
              <TabsContent value="all" className="m-0">
                <div className="rounded-md border">
                  <div className="grid grid-cols-7 px-4 py-3 bg-muted/50 text-sm font-medium">
                    <div>Patient</div>
                    <div>ID</div>
                    <div>Age</div>
                    <div>Gender</div>
                    <div>Phone</div>
                    <div>Last Visit</div>
                    <div>Status</div>
                  </div>
                  
                  {patients.map((patient) => (
                    <div 
                      key={patient.id} 
                      className="grid grid-cols-7 px-4 py-3 border-t text-sm items-center hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{patient.name}</span>
                      </div>
                      <div>{patient.id}</div>
                      <div>{patient.age}</div>
                      <div>{patient.gender}</div>
                      <div>{patient.phone}</div>
                      <div>{patient.lastVisit}</div>
                      <div>{getStatusBadge(patient.status)}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="active" className="m-0">
                <div className="rounded-md border">
                  <div className="grid grid-cols-7 px-4 py-3 bg-muted/50 text-sm font-medium">
                    <div>Patient</div>
                    <div>ID</div>
                    <div>Age</div>
                    <div>Gender</div>
                    <div>Phone</div>
                    <div>Last Visit</div>
                    <div>Status</div>
                  </div>
                  
                  {patients.filter(p => p.status === "Active").map((patient) => (
                    <div 
                      key={patient.id} 
                      className="grid grid-cols-7 px-4 py-3 border-t text-sm items-center hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{patient.name}</span>
                      </div>
                      <div>{patient.id}</div>
                      <div>{patient.age}</div>
                      <div>{patient.gender}</div>
                      <div>{patient.phone}</div>
                      <div>{patient.lastVisit}</div>
                      <div>{getStatusBadge(patient.status)}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="inactive" className="m-0">
                <div className="rounded-md border">
                  <div className="grid grid-cols-7 px-4 py-3 bg-muted/50 text-sm font-medium">
                    <div>Patient</div>
                    <div>ID</div>
                    <div>Age</div>
                    <div>Gender</div>
                    <div>Phone</div>
                    <div>Last Visit</div>
                    <div>Status</div>
                  </div>
                  
                  {patients.filter(p => p.status === "Inactive").map((patient) => (
                    <div 
                      key={patient.id} 
                      className="grid grid-cols-7 px-4 py-3 border-t text-sm items-center hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{patient.name}</span>
                      </div>
                      <div>{patient.id}</div>
                      <div>{patient.age}</div>
                      <div>{patient.gender}</div>
                      <div>{patient.phone}</div>
                      <div>{patient.lastVisit}</div>
                      <div>{getStatusBadge(patient.status)}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
              <div>Showing 5 of 48 patients</div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Patientsdemo;

import React, { useState, useEffect } from "react";
import { Filter, Plus, Search, UserPlus, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import PageContainer from "@/components/layout/PageContainer";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { baseUrl } from "@/utils/apiconfig";

const Patients = () => {
  const navigate = useNavigate();
  const hospital_id  = localStorage.getItem("hospitalid") || {};
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/hospitals/${hospital_id}/patients/`, {
        params: { search, status: tab === "all" ? "" : tab, page },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPatients(response.data.results || []);
      localStorage.setItem("patientid", response.data.results[0]?.patient_id);
      setTotalPages(Math.ceil(response.data.count / 10)); // Assuming 10 items per page
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [search, tab, page]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
      case "Inactive":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Patient Management</h1>
            <p className="text-muted-foreground">Manage patient records, prescriptions, and appointments</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex gap-2">
              <Filter size={16} />
            </Button>
            <Button className="flex gap-2" onClick={() => navigate(`/patients/add`)}>
              <UserPlus size={16} />
              Add Patient
            </Button>
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
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <TabsList>
                  <TabsTrigger value="all">All Patients</TabsTrigger>
                  <TabsTrigger value="Active">Active</TabsTrigger>
                  <TabsTrigger value="Inactive">Inactive</TabsTrigger>
                </TabsList>
                <div className="relative w-full sm:w-auto min-w-[200px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search patients..."
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <TabsContent value="all" className="m-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Last Visit</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patients.map((patient) => (
                        <TableRow
                          key={patient.patient_id}
                          className="hover:bg-muted/30 transition-colors cursor-pointer"
                          onClick={() => navigate(`/patients/${patient.patient_id}`)}
                        >
                          <TableCell className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{getInitials(`${patient.first_name} ${patient.last_name}`)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{`${patient.first_name} ${patient.last_name}`}</span>
                          </TableCell>
                          <TableCell>{patient.patient_id}</TableCell>
                          <TableCell>{patient.date_of_birth ? Math.floor((new Date().getTime() - new Date(patient.date_of_birth).getTime()) / (1000 * 60 * 60 * 24 * 365)) : '-'}</TableCell>
                          <TableCell>{patient.gender}</TableCell>
                          <TableCell>{patient.phone_number}</TableCell>
                          <TableCell>{patient.last_visit || 'N/A'}</TableCell>
                          <TableCell>{getStatusBadge(patient.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="Active" className="m-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Last Visit</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patients
                        .filter((p) => p.status === "Active")
                        .map((patient) => (
                          <TableRow
                            key={patient.patient_id}
                            className="hover:bg-muted/30 transition-colors cursor-pointer"
                            onClick={() => navigate(`/hospitals/${hospital_id}/patients/${patient.patient_id}`)}
                          >
                            <TableCell className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{getInitials(`${patient.first_name} ${patient.last_name}`)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{`${patient.first_name} ${patient.last_name}`}</span>
                            </TableCell>
                            <TableCell>{patient.patient_id}</TableCell>
                            <TableCell>{patient.date_of_birth ? Math.floor((new Date().getTime() - new Date(patient.date_of_birth).getTime()) / (1000 * 60 * 60 * 24 * 365)) : '-'}</TableCell>
                            <TableCell>{patient.gender}</TableCell>
                            <TableCell>{patient.phone_number}</TableCell>
                            <TableCell>{patient.last_visit || 'N/A'}</TableCell>
                            <TableCell>{getStatusBadge(patient.status)}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="Inactive" className="m-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Last Visit</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patients
                        .filter((p) => p.status === "Inactive")
                        .map((patient) => (
                          <TableRow
                            key={patient.patient_id}
                            className="hover:bg-muted/30 transition-colors cursor-pointer"
                            onClick={() => navigate(`/hospitals/${hospital_id}/patients/${patient.patient_id}`)}
                          >
                            <TableCell className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{getInitials(`${patient.first_name} ${patient.last_name}`)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{`${patient.first_name} ${patient.last_name}`}</span>
                            </TableCell>
                            <TableCell>{patient.patient_id}</TableCell>
                            <TableCell>{patient.date_of_birth ? Math.floor((new Date().getTime() - new Date(patient.date_of_birth).getTime()) / (1000 * 60 * 60 * 24 * 365)) : '-'}</TableCell>
                            <TableCell>{patient.gender}</TableCell>
                            <TableCell>{patient.phone_number}</TableCell>
                            <TableCell>{patient.last_visit || 'N/A'}</TableCell>
                            <TableCell>{getStatusBadge(patient.status)}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
              <div>Showing {patients.length} of {totalPages * 10} patients</div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Patients;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Filter, Download, Search, AlertCircle, Clock, CheckCircle2, X } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer-demo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

// Mock data for tickets
const mockTickets = [
  {
    id: "TICK-1001",
    title: "Ventilator not powering on",
    deviceId: "VEN-056",
    category: "hardware",
    priority: "critical",
    status: "open",
    location: "ICU Room 103",
    createdBy: "Dr. Sharma",
    createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    updatedAt: new Date(Date.now() - 50 * 60 * 1000), // 50 minutes ago
    assignedTo: "Engineer Patel",
  },
  {
    id: "TICK-1002",
    title: "Patient monitor showing incorrect readings",
    deviceId: "MON-124",
    category: "calibration",
    priority: "high",
    status: "in_progress",
    location: "Ward B, Room 215",
    createdBy: "Nurse Gupta",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    assignedTo: "Engineer Khan",
  },
  {
    id: "TICK-1003",
    title: "Need training on new defibrillator",
    deviceId: "DEF-042",
    category: "training",
    priority: "medium",
    status: "pending",
    location: "Emergency Department",
    createdBy: "Dr. Kumar",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    assignedTo: null,
  },
  {
    id: "TICK-1004",
    title: "Annual maintenance for MRI machine",
    deviceId: "MRI-002",
    category: "maintenance",
    priority: "low",
    status: "resolved",
    location: "Radiology Department",
    createdBy: "Tech Singh",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    assignedTo: "Engineer Kapoor",
  },
  {
    id: "TICK-1005",
    title: "ECG machine software update required",
    deviceId: "ECG-078",
    category: "software",
    priority: "medium",
    status: "open",
    location: "Cardiology Department",
    createdBy: "Dr. Verma",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    assignedTo: null,
  },
];

const Ticketsdemo = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState(mockTickets);
  const [filter, setFilter] = useState("all");

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  const filteredTickets = filter === "all" 
    ? tickets 
    : tickets.filter(ticket => ticket.status === filter);

  // Function to render status badge with appropriate colors
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Open</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Function to render priority badge with appropriate colors
  const renderPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Badge className="bg-red-500">Critical</Badge>;
      case "high":
        return <Badge className="bg-orange-500">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case "low":
        return <Badge className="bg-blue-500">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  return (
    <PageContainer>
      <div className="container mx-auto py-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Support Tickets</h1>
            <p className="text-muted-foreground">
              Manage and respond to technical support requests
            </p>
          </div>
          <Button onClick={() => navigate("/demo/ticket-raise")} className="flex gap-2">
            <Plus size={16} />
            New Ticket
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card 
            className={`hover:shadow-md cursor-pointer bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-100 dark:border-purple-800/30 ${filter === 'all' ? 'border-purple-300' : ''}`} 
            onClick={() => handleFilterChange('all')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{tickets.length}</div>
                  <p className="text-sm text-muted-foreground">All Tickets</p>
                </div>
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                  <AlertCircle size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`hover:shadow-md cursor-pointer bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-100 dark:border-red-800/30 ${filter === 'open' ? 'border-red-300' : ''}`} 
            onClick={() => handleFilterChange('open')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{tickets.filter(t => t.status === 'open').length}</div>
                  <p className="text-sm text-muted-foreground">Open Tickets</p>
                </div>
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                  <X size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`hover:shadow-md cursor-pointer bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-100 dark:border-blue-800/30 ${filter === 'in_progress' ? 'border-blue-300' : ''}`} 
            onClick={() => handleFilterChange('in_progress')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{tickets.filter(t => t.status === 'in_progress').length}</div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <Clock size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`hover:shadow-md cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800/30 ${filter === 'resolved' ? 'border-green-300' : ''}`} 
            onClick={() => handleFilterChange('resolved')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{tickets.filter(t => t.status === 'resolved').length}</div>
                  <p className="text-sm text-muted-foreground">Resolved Tickets</p>
                </div>
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  <CheckCircle2 size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search tickets..." className="pl-10" />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Filter size={16} />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleFilterChange("all")}>All Tickets</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("open")}>Open Tickets</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("in_progress")}>In Progress</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("pending")}>Pending</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("resolved")}>Resolved</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" className="flex gap-2">
              <Download size={16} />
              Export
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-md border shadow-sm overflow-hidden">
          <Table>
            <TableCaption>A list of all support tickets.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Ticket ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Device ID</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow 
                  key={ticket.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/demo/ticket/${ticket.id}`)}
                >
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{ticket.title}</div>
                      <div className="text-xs text-muted-foreground">{ticket.location}</div>
                    </div>
                  </TableCell>
                  <TableCell>{ticket.deviceId || "--"}</TableCell>
                  <TableCell>{renderPriorityBadge(ticket.priority)}</TableCell>
                  <TableCell>{renderStatusBadge(ticket.status)}</TableCell>
                  <TableCell>{formatDistanceToNow(ticket.createdAt, { addSuffix: true })}</TableCell>
                  <TableCell>{ticket.assignedTo || "--"}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        navigate(`/demo/ticket/${ticket.id}`);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTickets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                    No tickets found for the selected filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageContainer>
  );
};

export default Ticketsdemo;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Filter, Download, Search, AlertCircle, Clock, CheckCircle2, X } from "lucide-react";
import axios from "axios";
import PageContainer from "@/components/layout/PageContainer";
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
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { baseUrl } from "@/utils/apiconfig";

const Tickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hospitalId, setHospitalId] = useState(null);
  const [page, setPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(1); // Track total pages

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found.");
        }
        const response = await axios.get(`${baseUrl}/api/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("User Profile Response:", response.data);
        if (!response.data.hospital) {
          throw new Error("Hospital ID not found in profile.");
        }
        setHospitalId(response.data.hospital);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setError("Couldn’t fetch your profile. Please log out and try again.");
        toast({
          title: "Error",
          description: "Failed to load user profile. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (!hospitalId) return;

    const fetchTickets = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/api/${hospitalId}/tickets/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            status: filter === "all" ? undefined : filter,
            search: search || undefined,
            page, // Add page parameter to fetch specific page
          },
        });
        console.log("Tickets API Response:", response.data);
        const ticketData = Array.isArray(response.data.results) ? response.data.results : [];
        setTickets(ticketData);
        // Calculate total pages assuming 10 tickets per page
        setTotalPages(Math.ceil(response.data.count / 10));
        setError(null);
      } catch (err) {
        console.error("Fetch Tickets Error:", err);
        const errorMessage = err.response?.data?.detail || "Failed to fetch tickets. Please try again.";
        setError(errorMessage);
        setTickets([]);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [hospitalId, filter, search, page]); // Add page to dependencies

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1); // Reset to first page when filter changes
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when search changes
  };

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(prev - 1, 1)); // Prevent going below page 1
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(prev + 1, totalPages)); // Prevent going beyond total pages
  };

  const renderStatusBadge = (status) => {
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
        return <Badge variant="outline">{status || "Unknown"}</Badge>;
    }
  };

  const renderPriorityBadge = (priority) => {
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
        return <Badge>{priority || "Unknown"}</Badge>;
    }
  };

  if (!hospitalId && !error) {
    return (
      <PageContainer>
        <div className="container mx-auto py-6">Loading profile...</div>
      </PageContainer>
    );
  }

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
          <Button onClick={() => navigate("/ticket-raise")} className="flex gap-2">
            <Plus size={16} />
            New Ticket
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading tickets...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card
                className={`hover:shadow-md cursor-pointer bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-100 dark:border-purple-800/30 ${filter === "all" ? "border-purple-300" : ""}`}
                onClick={() => handleFilterChange("all")}
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
                className={`hover:shadow-md cursor-pointer bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-100 dark:border-red-800/30 ${filter === "open" ? "border-red-300" : ""}`}
                onClick={() => handleFilterChange("open")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold">{tickets.filter((t) => t.status === "open").length}</div>
                      <p className="text-sm text-muted-foreground">Open Tickets</p>
                    </div>
                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                      <X size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`hover:shadow-md cursor-pointer bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-100 dark:border-blue-800/30 ${filter === "in_progress" ? "border-blue-300" : ""}`}
                onClick={() => handleFilterChange("in_progress")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold">{tickets.filter((t) => t.status === "in_progress").length}</div>
                      <p className="text-sm text-muted-foreground">In Progress</p>
                    </div>
                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      <Clock size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`hover:shadow-md cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800/30 ${filter === "resolved" ? "border-green-300" : ""}`}
                onClick={() => handleFilterChange("resolved")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold">{tickets.filter((t) => t.status === "resolved").length}</div>
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
                <Input
                  placeholder="Search tickets..."
                  className="pl-10"
                  value={search}
                  onChange={handleSearchChange}
                />
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
                    <DropdownMenuItem onClick={() => handleFilterChange("resolved")}>Resolved Tickets</DropdownMenuItem>
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
                  {tickets.map((ticket) => (
                    <TableRow
                      key={ticket.ticket_id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/ticket/${ticket.ticket_id}`)}
                    >
                      <TableCell className="font-medium">{ticket.ticket_id || "--"}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{ticket.title || "No Title"}</div>
                          <div className="text-xs text-muted-foreground">{ticket.location || "No Location"}</div>
                        </div>
                      </TableCell>
                      <TableCell>{ticket.device?.asset_number || "--"}</TableCell>
                      <TableCell>{renderPriorityBadge(ticket.priority)}</TableCell>
                      <TableCell>{renderStatusBadge(ticket.status)}</TableCell>
                      <TableCell>
                        {ticket.created_at
                          ? formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })
                          : "--"}
                      </TableCell>
                      <TableCell>
                        {ticket.assigned_to?.name || "--"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/ticket/${ticket.ticket_id}`);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {tickets.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                        No tickets found for the selected filter.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                disabled={page === 1 || loading}
                onClick={handlePreviousPage}
              >
                Previous
              </Button>
              <span className="text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page === totalPages || loading}
                onClick={handleNextPage}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
};

export default Tickets;
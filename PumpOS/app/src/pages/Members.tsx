import { useState, useEffect } from "react";
import { Search, Filter, Plus, MoreHorizontal, Mail, Phone, Calendar, Users } from "lucide-react";
import { AddMemberDialog } from "@/components/members/AddMemberDialog";
import { MemberProfile } from "@/components/members/MemberProfile";
import { EditMemberDialog } from "@/components/members/EditMemberDialog";
import { MessageMemberDialog } from "@/components/members/MessageMemberDialog";
import { MemberActivityDialog } from "@/components/members/MemberActivityDialog";
import { AddClassDialog } from "@/components/classes/AddClassDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "@/utils/api";

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  membership: string;
  classes: number[];
  join_date: string;
  last_visit: string;
  status: string;
  avatar?: string;
}

interface MembershipStat {
  type: string;
  count: number;
  color: string;
}

const Members = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [membershipFilter, setMembershipFilter] = useState("all");
  const [members, setMembers] = useState<Member[]>([]);
  const [membershipStats, setMembershipStats] = useState<MembershipStat[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMembers = async () => {
    try {
      const response = await api.get("/api/members/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const membersData = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      if (!Array.isArray(membersData)) {
        throw new Error("Invalid members data format");
      }
      setMembers(membersData);
    } catch (error: any) {
      console.error("Error fetching members:", error);
      toast({
        title: "Error",
        description: "Failed to fetch members.",
        variant: "destructive",
      });
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const fetchMembershipStats = async () => {
    try {
      const response = await api.get("/api/membership-stats/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMembershipStats(Array.isArray(response.data) ? response.data : []);
    } catch (error: any) {
      console.error("Error fetching membership stats:", error);
      toast({
        title: "Error",
        description: "Failed to fetch membership stats.",
        variant: "destructive",
      });
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  // Fetch data on mount and after adding member/class
  const fetchData = async () => {
    setIsLoading(true);
    await Promise.all([fetchMembers(), fetchMembershipStats()]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [toast, navigate]);

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMembership =
      membershipFilter === "all" || member.membership.toLowerCase() === membershipFilter.toLowerCase();
    return matchesSearch && matchesMembership;
  });

  const handleMemberAction = (action: string, member: Member) => {
    toast({
      title: `${action} Member`,
      description: `${action} action performed for ${member.name}`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-success/10 text-success">Active</Badge>;
      case "Expired":
        return <Badge className="bg-destructive/10 text-destructive">Expired</Badge>;
      case "Suspended":
        return <Badge className="bg-warning/10 text-warning">Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getMembershipBadge = (membership: string) => {
    switch (membership) {
      case "Premium":
        return <Badge className="bg-primary/10 text-primary">Premium</Badge>;
      case "Basic":
        return <Badge className="bg-accent/10 text-accent">Basic</Badge>;
      case "Student":
        return <Badge className="bg-success/10 text-success">Student</Badge>;
      default:
        return <Badge variant="outline">{membership}</Badge>;
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-background rounded-xl border border-border/50 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Members Directory
            </h1>
            <p className="text-muted-foreground text-lg">Manage your gym members and their memberships</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <AddClassDialog onClassAdded={fetchData} />
            <AddMemberDialog onMemberAdded={fetchData} />
          </div>
        </div>
      </div>

      {/* Membership Stats */}
      {isLoading ? (
        <div className="text-center text-muted-foreground">Loading...</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {membershipStats.map((stat) => (
            <Card
              key={stat.type}
              className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color}/10`}>
                    <Users className={`h-6 w-6 ${stat.color.replace("bg-", "text-")}`} />
                  </div>
                  <Badge className={`${stat.color}/10 ${stat.color.replace("bg-", "text-")} border-${stat.color.replace("bg-", "")}/30`}>
                    {stat.type}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold">{stat.count}</p>
                  <p className="text-sm text-muted-foreground">{stat.type} Members</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Member Directory */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-card/50 to-card">
        <CardHeader className="pb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-semibold">Member Directory</CardTitle>
              <CardDescription className="text-base mt-2">Manage your gym members and their memberships</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64 shadow-sm"
                  disabled={isLoading}
                />
              </div>
              <select
                value={membershipFilter}
                onChange={(e) => setMembershipFilter(e.target.value)}
                className="px-3 py-2 border rounded-md shadow-sm bg-background"
                disabled={isLoading}
              >
                <option value="all">All Memberships</option>
                {membershipStats.map((stat) => (
                  <option key={stat.type} value={stat.type.toLowerCase()}>
                    {stat.type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          {/* Mobile Member Cards */}
          <div className="block lg:hidden px-6 space-y-4">
            {isLoading ? (
              <div className="text-center text-muted-foreground">Loading members...</div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center text-muted-foreground">No members found.</div>
            ) : (
              filteredMembers.map((member) => (
                <Card key={member.id} className="shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {member.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-lg">{member.name}</div>
                          <div className="text-sm text-muted-foreground">ID: {member.id.toString().padStart(4, "0")}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        {getStatusBadge(member.status)}
                        {getMembershipBadge(member.membership)}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{member.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{member.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Joined: {new Date(member.join_date).toLocaleDateString()}</span>
                        </div>
                        <span className="text-muted-foreground">
                          Last visit: {new Date(member.last_visit).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" disabled={isLoading}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            {/* View Profile */}
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedMember(member);
                                setShowProfile(true);
                              }}
                            >
                              View Profile
                            </DropdownMenuItem>

                            {/* Edit Member */}
                            <DropdownMenuItem asChild>
                              <EditMemberDialog
                                member={member}
                                trigger={
                                  <button className="w-full text-left cursor-pointer">
                                    Edit Member
                                  </button>
                                }
                              />
                            </DropdownMenuItem>

                            {/* View Activity */}
                            <DropdownMenuItem asChild>
                              <MemberActivityDialog
                                member={member}
                                trigger={
                                  <button className="w-full text-left cursor-pointer">
                                    View Activity
                                  </button>
                                }
                              />
                            </DropdownMenuItem>

                            {/* Send Message */}
                            <DropdownMenuItem asChild>
                              <MessageMemberDialog
                                member={member}
                                trigger={
                                  <button className="w-full text-left cursor-pointer">
                                    Send Message
                                  </button>
                                }
                              />
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {/* Deactivate */}
                            <DropdownMenuItem
                              className="text-destructive cursor-pointer"
                              onClick={() => {
                                if (confirm(`Deactivate ${member.name}?`)) {
                                  handleMemberAction("Deactivate", member);
                                }
                              }}
                            >
                              Deactivate
                            </DropdownMenuItem>
                          </DropdownMenuContent>

                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Desktop Members Table */}
          <div className="hidden lg:block">
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Member</TableHead>
                    <TableHead className="font-semibold">Contact</TableHead>
                    <TableHead className="font-semibold">Membership</TableHead>
                    <TableHead className="font-semibold">Join Date</TableHead>
                    <TableHead className="font-semibold">Last Visit</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        Loading members...
                      </TableCell>
                    </TableRow>
                  ) : filteredMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No members found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMembers.map((member) => (
                      <TableRow key={member.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {member.name.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-muted-foreground">ID: {member.id.toString().padStart(4, "0")}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="mr-1 h-3 w-3" />
                              {member.email}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Phone className="mr-1 h-3 w-3" />
                              {member.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getMembershipBadge(member.membership)}</TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Calendar className="mr-1 h-3 w-3" />
                            {new Date(member.join_date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(member.last_visit).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(member.status)}</TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedMember(member);
                                    setShowProfile(true);
                                  }}
                                >
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <EditMemberDialog member={member} trigger={<span className="w-full cursor-pointer">Edit Member</span>} />
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <MemberActivityDialog
                                    member={member}
                                    trigger={<span className="w-full cursor-pointer">View Activity</span>}
                                  />
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                  <MessageMemberDialog
                                    member={member}
                                    trigger={<span className="w-full cursor-pointer">Send Message</span>}
                                  />
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleMemberAction("Deactivate", member)}
                                >
                                  Deactivate
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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

      <MemberProfile member={selectedMember} open={showProfile} onOpenChange={setShowProfile} />
    </div>
  );
};

export default Members;
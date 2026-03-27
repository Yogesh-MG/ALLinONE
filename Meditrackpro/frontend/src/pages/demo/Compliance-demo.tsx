import React, { useState } from "react";
import { CalendarCheck, FileText, ShieldCheck, AlertCircle, Download, Plus, Calendar as CalendarIcon } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer-demo";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const Compliancedemo = () => {
  const { toast } = useToast();
  const [showAuditDialog, setShowAuditDialog] = useState(false);
  const [auditDate, setAuditDate] = useState<Date | undefined>(new Date());
  const [auditType, setAuditType] = useState("");
  const [auditNotes, setAuditNotes] = useState("");
  const [auditor, setAuditor] = useState("");

  const [complianceData, setComplianceData] = useState([
    { id: 1, name: "FDA Compliance", status: "Compliant", lastAudit: "2023-10-15", nextAudit: "2024-04-15", progress: 100 },
    { id: 2, name: "ISO 13485:2016", status: "Pending Review", lastAudit: "2023-09-01", nextAudit: "2024-03-01", progress: 85 },
    { id: 3, name: "HIPAA Compliance", status: "Compliant", lastAudit: "2023-11-10", nextAudit: "2024-05-10", progress: 100 },
    { id: 4, name: "WHO Standards", status: "Requires Attention", lastAudit: "2023-08-20", nextAudit: "2024-02-20", progress: 68 },
  ]);

  const [upcomingAudits, setUpcomingAudits] = useState([
    { id: 1, title: "FDA Annual Inspection", date: "2024-04-15", status: "Scheduled" },
    { id: 2, title: "ISO Recertification", date: "2024-03-01", status: "Pending" },
    { id: 3, title: "HIPAA Compliance Review", date: "2024-05-10", status: "Scheduled" },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Compliant":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Compliant</Badge>;
      case "Pending Review":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Pending Review</Badge>;
      case "Requires Attention":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Requires Attention</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleScheduleAudit = () => {
    if (!auditType || !auditDate || !auditor) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newAudit = {
      id: Date.now(),
      title: auditType,
      date: format(auditDate, "yyyy-MM-dd"),
      status: "Scheduled"
    };

    setUpcomingAudits([...upcomingAudits, newAudit]);
    setShowAuditDialog(false);
    setAuditType("");
    setAuditor("");
    setAuditNotes("");

    toast({
      title: "Audit Scheduled",
      description: `${auditType} audit has been scheduled for ${format(auditDate, "MMMM d, yyyy")}.`
    });
  };

  const exportComplianceReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Compliance Standard,Status,Last Audit,Next Audit,Progress\n"
      + complianceData.map(item => 
          `${item.name},${item.status},${item.lastAudit},${item.nextAudit},${item.progress}%`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `compliance-report-${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: "Compliance report has been exported."
    });
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Compliance Management</h1>
            <p className="text-muted-foreground">
              Monitor and manage regulatory compliance for your medical facility
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex gap-2" onClick={exportComplianceReport}>
              <FileText size={16} />
              Export Report
            </Button>
            <Dialog open={showAuditDialog} onOpenChange={setShowAuditDialog}>
              <DialogTrigger asChild>
                <Button className="flex gap-2">
                  <ShieldCheck size={16} />
                  Schedule Audit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Schedule Compliance Audit</DialogTitle>
                  <DialogDescription>
                    Schedule a new audit to ensure compliance with regulatory standards.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="auditType" className="col-span-4">Audit Type</Label>
                    <Select value={auditType} onValueChange={setAuditType} required>
                      <SelectTrigger id="auditType" className="col-span-4">
                        <SelectValue placeholder="Select audit type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FDA Compliance">FDA Compliance</SelectItem>
                        <SelectItem value="ISO 13485:2016">ISO 13485:2016</SelectItem>
                        <SelectItem value="HIPAA Compliance">HIPAA Compliance</SelectItem>
                        <SelectItem value="WHO Standards">WHO Standards</SelectItem>
                        <SelectItem value="CE Mark Inspection">CE Mark Inspection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="auditDate" className="col-span-4">Audit Date</Label>
                    <div className="col-span-4">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !auditDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {auditDate ? format(auditDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 min-w-[300px]"
                          align="start"
                          side="bottom"
                          forceMount
                          style={{ zIndex: 1000 }}
                        >
                          <div className="p-2 bg-blue-100">
                            Calendar should appear below:
                          </div>
                          <Calendar
                            mode="single"
                            selected={auditDate}
                            onSelect={(date) => setAuditDate(date || new Date())}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="auditor" className="col-span-4">Auditor</Label>
                    <Input
                      id="auditor"
                      value={auditor}
                      onChange={(e) => setAuditor(e.target.value)}
                      placeholder="Name of auditor/auditing organization"
                      className="col-span-4"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="col-span-4">Notes</Label>
                    <Textarea
                      id="notes"
                      value={auditNotes}
                      onChange={(e) => setAuditNotes(e.target.value)}
                      placeholder="Additional notes about the audit"
                      className="col-span-4"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" onClick={handleScheduleAudit}>Schedule Audit</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {complianceData.map((compliance) => (
            <DashboardCard 
              key={compliance.id} 
              title={compliance.name}
              description={compliance.status}
              footer={
                <div className="w-full">
                  <div className="flex justify-between mb-1 text-xs">
                    <span>Compliance: {compliance.progress}%</span>
                    <span>Last audit: {compliance.lastAudit}</span>
                  </div>
                  <Progress 
                    value={compliance.progress} 
                    className="h-1.5 w-full bg-gray-200"
                    indicatorColor={compliance.progress === 100 ? "bg-blue-500" : "bg-gray-500"}
                  />
                </div>
              }
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusBadge(compliance.status)}
                </div>
                <p className="text-sm mb-1">
                  <span className="font-medium">Last Audit:</span> {compliance.lastAudit}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Next Audit:</span> {compliance.nextAudit}
                </p>
              </div>
            </DashboardCard>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DashboardCard 
            title="Upcoming Audits" 
            description="Scheduled compliance audits"
            className="lg:col-span-1"
          >
            <div className="space-y-4">
              {upcomingAudits.map((audit) => (
                <div key={audit.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                  <div className="p-2 rounded-md bg-primary/10">
                    <CalendarCheck size={18} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{audit.title}</h4>
                    <p className="text-muted-foreground text-xs">{audit.date}</p>
                    <Badge variant="outline" className="mt-1 text-xs">{audit.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard 
            title="Documentation" 
            description="Required regulatory documents"
            className="lg:col-span-2"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">FDA Documentation</span>
                  <Badge>Complete</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">All required documents for FDA compliance</p>
                <Button variant="outline" size="sm" className="w-full">View Documents</Button>
              </div>
              <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">ISO Certification</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">In Progress</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">ISO 13485:2016 certification documents</p>
                <Button variant="outline" size="sm" className="w-full">Update Documents</Button>
              </div>
              <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">HIPAA Compliance</span>
                  <Badge>Complete</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Patient data protection documentation</p>
                <Button variant="outline" size="sm" className="w-full">View Documents</Button>
              </div>
              <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">WHO Guidelines</span>
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Attention Required</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">World Health Organization standards</p>
                <Button variant="outline" size="sm" className="w-full">Complete Documents</Button>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </PageContainer>
  );
};

export default Compliancedemo;
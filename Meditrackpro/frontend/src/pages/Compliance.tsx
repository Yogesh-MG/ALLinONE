import React, { useState, useEffect } from 'react';
import { CalendarCheck, FileText, ShieldCheck } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { baseUrl } from '@/utils/apiconfig';

// Define interfaces for API data and errors
interface ComplianceStandard {
  id: number;
  name: string;
  status: 'Compliant' | 'Pending Review' | 'Requires Attention';
  progress: number;
  last_audit_date: string | null;
  next_audit_date: string | null;
}

interface Audit {
  id: number;
  title: string;
  audit_date: string;
  status: 'Scheduled' | 'Pending' | 'Completed';
}

interface ComplianceDocument {
  id: number;
  name: string;
  status: 'Complete' | 'In Progress' | 'Attention Required';
  file: string;
  compliance_standard: { id: number; name: string };
}

interface ApiError {
  response?: {
    data?: {
      detail?: string;
      [key: string]: string | string[] | undefined;
    };
  };
  message?: string;
}

interface ScheduleAuditInput {
  title: string;
  audit_date: string;
  auditor: string;
  notes: string;
  compliance_standard_id: number;
}

const Compliance = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [hospitalId, setHospitalId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [showAuditDialog, setShowAuditDialog] = useState(false);
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [auditDate, setAuditDate] = useState<Date | undefined>(new Date());
  const [auditType, setAuditType] = useState('');
  const [auditNotes, setAuditNotes] = useState('');
  const [auditor, setAuditor] = useState('');
  const [complianceStandardId, setComplianceStandardId] = useState<number | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentStandardId, setDocumentStandardId] = useState<number | null>(null);
  const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = date.getDate(); // no padStart, since you want like '1 Jan'
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
  };
  // Fetch user profile to get hospitalId
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!token) {
          throw new Error('No authentication token found.');
        }
        const response = await axios.get(`${baseUrl}/api/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('User Profile Response:', response.data);
        if (!response.data.hospital) {
          throw new Error('Hospital ID not found in profile.');
        }
        setHospitalId(response.data.hospital);
        localStorage.setItem('hospitalId', response.data.hospital);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load user profile. Please log out and try again.',
          variant: 'destructive',
        });
      }
    };

    fetchUserProfile();
  }, [token]);

  // Axios instance with default headers
  const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      'Content-Type': 'application/json',
    },
  });

  // Fetch compliance standards
  const { data: complianceData, isLoading: standardsLoading, error: standardsError } = useQuery<
    ComplianceStandard[],
    ApiError
  >({
    queryKey: ['complianceStandards', hospitalId],
    queryFn: async () => {
      if (!hospitalId) throw new Error('Hospital ID not available');
      const response = await axiosInstance.get(`/api/hospitals/${hospitalId}/compliance/standards/`);
      console.log('Standards Response:', response.data);
      return response.data;
    },
    enabled: !!hospitalId && !!token,
  });

  // Fetch audits
  const { data: upcomingAudits, isLoading: auditsLoading, error: auditsError } = useQuery<Audit[], ApiError>({
    queryKey: ['audits', hospitalId],
    queryFn: async () => {
      if (!hospitalId) throw new Error('Hospital ID not available');
      const response = await axiosInstance.get(`/api/hospitals/${hospitalId}/compliance/audits/`);
      console.log('Audits Response:', response.data);
      return response.data;
    },
    enabled: !!hospitalId && !!token,
  });

  // Fetch documents
  const { data: documents, isLoading: documentsLoading, error: documentsError } = useQuery<
    ComplianceDocument[],
    ApiError
  >({
    queryKey: ['documents', hospitalId],
    queryFn: async () => {
      if (!hospitalId) throw new Error('Hospital ID not available');
      const response = await axiosInstance.get(`/api/hospitals/${hospitalId}/compliance/documents/`);
      console.log('Documents Response:', response.data);
      return response.data;
    },
    enabled: !!hospitalId && !!token,
  });

  // Schedule audit mutation
  const scheduleAuditMutation = useMutation<Audit, ApiError, ScheduleAuditInput>({
    mutationFn: async (auditData) => {
      if (!hospitalId) throw new Error('Hospital ID not available');
      const response = await axiosInstance.post(`/api/hospitals/${hospitalId}/compliance/audits/`, auditData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audits', hospitalId] });
      setShowAuditDialog(false);
      setAuditType('');
      setAuditor('');
      setAuditNotes('');
      setComplianceStandardId(null);
      toast({
        title: 'Audit Scheduled',
        description: `${auditType} audit has been scheduled for ${format(auditDate!, 'MMMM d, yyyy')}.`,
      });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.detail ||
        (typeof error.response?.data === 'object'
          ? Object.values(error.response?.data).flat().join(', ')
          : error.message || 'Failed to schedule audit.');
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  // Upload document mutation
  const uploadDocumentMutation = useMutation<ComplianceDocument, ApiError>({
    mutationFn: async () => {
      if (!hospitalId || !documentFile || !documentName || !documentStandardId) {
        throw new Error('Missing required fields');
      }
      const formData = new FormData();
      formData.append('name', documentName);
      formData.append('file', documentFile);
      formData.append('compliance_standard', documentStandardId.toString()); // Match backend field name
      const response = await axiosInstance.post(`/api/hospitals/${hospitalId}/compliance/documents/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', hospitalId] });
      setShowDocumentDialog(false);
      setDocumentName('');
      setDocumentFile(null);
      setDocumentStandardId(null);
      toast({
        title: 'Document Uploaded',
        description: 'Compliance document has been uploaded successfully.',
      });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.detail ||
        (typeof error.response?.data === 'object'
          ? Object.values(error.response?.data).flat().join(', ')
          : error.message || 'Failed to upload document.');
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  // Export report mutation
  const exportReportMutation = useMutation<Blob, ApiError>({
    mutationFn: async () => {
      if (!hospitalId) throw new Error('Hospital ID not available');
      const response = await axiosInstance.get(`/api/hospitals/${hospitalId}/compliance/export/`, {
        responseType: 'blob',
      });
      return response.data;
    },
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `compliance-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: 'Export Complete',
        description: 'Compliance report has been exported.',
      });
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to export compliance report.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Compliant':
      case 'Complete':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{status}</Badge>;
      case 'Pending Review':
      case 'Pending':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{status}</Badge>;
      case 'Requires Attention':
      case 'Attention Required':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleScheduleAudit = () => {
    if (!auditType || !auditDate || !auditor || !complianceStandardId) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    scheduleAuditMutation.mutate({
      title: auditType,
      audit_date: format(auditDate, 'yyyy-MM-dd'),
      auditor,
      notes: auditNotes,
      compliance_standard_id: complianceStandardId,
    });
  };

  // Loading and error states
  if (!hospitalId) {
    return (
      <PageContainer>
        <div className="container mx-auto py-6">Loading profile...</div>
      </PageContainer>
    );
  }

  if (standardsError || auditsError || documentsError) {
    return (
      <PageContainer>
        <div className="container mx-auto py-6 text-red-500">
          Error: {standardsError?.message || auditsError?.message || documentsError?.message || 'Failed to load data.'}
        </div>
      </PageContainer>
    );
  }

  if (standardsLoading || auditsLoading || documentsLoading) {
    return (
      <PageContainer>
        <div className="container mx-auto py-6">Loading compliance data...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Compliance Management</h1>
            <p className="text-muted-foreground">Monitor and manage regulatory compliance for your medical facility</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex gap-2" onClick={() => exportReportMutation.mutate()}>
              <FileText size={16} />
              Export Report
            </Button>
            <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <FileText size={16} />
                  Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Upload Compliance Document</DialogTitle>
                  <DialogDescription>Upload a document for a compliance standard.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="documentStandard" className="col-span-4">
                      Compliance Standard
                    </Label>
                    <Select
                      onValueChange={(value) => setDocumentStandardId(parseInt(value))}
                      required
                    >
                      <SelectTrigger id="documentStandard" className="col-span-4">
                        <SelectValue placeholder="Select compliance standard" />
                      </SelectTrigger>
                      <SelectContent>
                        {complianceData?.map((standard) => (
                          <SelectItem key={standard.id} value={standard.id.toString()}>
                            {standard.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="documentName" className="col-span-4">
                      Document Name
                    </Label>
                    <Input
                      id="documentName"
                      value={documentName}
                      onChange={(e) => setDocumentName(e.target.value)}
                      placeholder="Document name"
                      className="col-span-4"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="documentFile" className="col-span-4">
                      Document File
                    </Label>
                    <Input
                      id="documentFile"
                      type="file"
                      onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                      className="col-span-4"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" onClick={() => uploadDocumentMutation.mutate()}>
                    Upload Document
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                  <DialogDescription>Schedule a new audit to ensure compliance with regulatory standards.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="auditType" className="col-span-4">
                      Audit Type
                    </Label>
                    <Select
                      value={auditType}
                      onValueChange={(value) => {
                        setAuditType(value);
                        const standard = complianceData?.find((s) => s.name === value);
                        setComplianceStandardId(standard?.id || null);
                      }}
                      required
                    >
                      <SelectTrigger id="auditType" className="col-span-4">
                        <SelectValue placeholder="Select audit type" />
                      </SelectTrigger>
                      <SelectContent>
                        {complianceData?.map((standard) => (
                          <SelectItem key={standard.id} value={standard.name}>
                            {standard.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="auditDate" className="col-span-4">
                      Audit Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn('w-full justify-start text-left font-normal', !auditDate && 'text-muted-foreground')}
                        >
                          <CalendarCheck className="mr-2 h-4 w-4" />
                          {auditDate ? format(auditDate, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={auditDate}
                          onSelect={setAuditDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="auditor" className="col-span-4">
                      Auditor
                    </Label>
                    <Input
                      id="auditor"
                      value={auditor}
                      onChange={(e) => setAuditor(e.target.value)}
                      placeholder="Name of auditor/auditing organization"
                      className="col-span-4"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="col-span-4">
                      Notes
                    </Label>
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
                  <Button type="button" onClick={handleScheduleAudit}>
                    Schedule Audit
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {complianceData?.map((compliance) => (
            <DashboardCard
              key={compliance.id}
              title={compliance.name}
              description={compliance.status}
              footer={
                <div className="w-full">
                  <div className="flex justify-between mb-1 text-xs">
                    <span>Compliance: {compliance.progress}%</span>
                    <span>Last audit: {formatDate(compliance.last_audit_date || 'N/A')}</span>
                  </div>
                  <Progress
                    value={compliance.progress}
                    className="h-1.5 w-full bg-gray-200"
                    indicatorColor={compliance.progress === 100 ? 'bg-blue-500' : 'bg-gray-500'}
                  />
                </div>
              }
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">{getStatusBadge(compliance.status)}</div>
                <p className="text-sm mb-1">
                  <span className="font-medium">Last Audit:</span> {formatDate(compliance.last_audit_date || 'N/A')}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Next Audit:</span> {formatDate(compliance.next_audit_date || 'N/A')}
                </p>
              </div>
            </DashboardCard>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DashboardCard title="Upcoming Audits" description="Scheduled compliance audits" className="lg:col-span-1">
            <div className="space-y-4">
              {upcomingAudits?.map((audit) => (
                <div
                  key={audit.id}
                  className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="p-2 rounded-md bg-primary/10">
                    <CalendarCheck size={18} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{audit.title}</h4>
                    <p className="text-muted-foreground text-xs">{audit.audit_date}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {audit.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard title="Documentation" description="Required regulatory documents" className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {documents?.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{doc.name}</span>
                    {getStatusBadge(doc.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{doc.compliance_standard?.name}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open(doc.file, '_blank')}
                  >
                    View Document
                  </Button>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>
    </PageContainer>
  );
};

export default Compliance;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft, ClipboardList, Download, FileText, History, Ticket, Wrench, Pencil } from "lucide-react";
import axios from "axios";
import { baseUrl } from "@/utils/apiconfig";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

// Define TypeScript interfaces
interface FormData {
  name: string;
  make_model: string;
  manufacture: string;
  date_of_installation: string;
  warranty_until: string;
  asset_details: string | null;
  is_active: string | null;
  department: string;
  Room: string;
  next_calibration: string;
  serial_number?: string; // Added as optional since it’s displayed but not editable
  asset_number?: string; // Added as optional since it’s displayed but not editable
}

interface SpecData {
  power_supply?: string;
  battery_type?: string;
  battery_life?: string;
  weight?: string;
  dimensions?: string;
  conncetivity_options?: string; // Typo in API
  certifications?: string;
}

interface ServiceData {
  service_date?: string;
  service_type?: string;
  engineer_id?: number | string;
  service_details?: string;
}

interface DocData {
  document?: string;
  types?: string;
  last_updated?: string;
  storage_location?: string;
}

interface IncidentData {
  incident_date?: string;
  incident_type?: string;
  reported_by_id?: number | string;
  related_employee_id?: number | string;
  description?: string;
}

interface Employee {
  id: string;
  name: string;
}

interface MaintenanceForm {
  service_date: string;
  service_type: string;
  engineer_id: string;
  service_details: string;
  document?: File | null; // New field for file upload
}

interface CalibrationForm {
  calibration_date: Date;
  next_calibration: Date | undefined;
  notes: string;
  engineer_id: string;
  document?: File | null; // New field for file upload
}

interface Technician {
  id: string;
  name: string;
}

interface ServiceLog {
  id: string;
  service_date: string;
  service_type: string;
  engineer?: { name: string };
  service_details: string;
}

interface Calibration {
  id: string;
  calibration_date: string;
  notes: string;
  result?: string;
  engineer?: { name: string };
}

interface IncidentReport {
  id: string;
  incident_date: string;
  incident_type: string;
  reported_by?: { user: { name: string } };
  related_employee?: { user: { name: string } };
  description: string;
}

interface Documentation {
  id: string;
  document: string;
  types: string;
  last_updated: string;
  storage_location: string;
}

interface Specification {
  id: string;
  power_supply: string;
  battery_type: string;
  battery_life: string;
  weight: string;
  dimensions: string;
  conncetivity_options: string;
  certifications: string;
}

interface Device {
  id: string;
  name: string;
  make_model: string;
  manufacture: string;
  date_of_installation: string;
  warranty_until: string;
  asset_details: string | null;
  is_active: string | null;
  department: string;
  Room: string;
  next_calibration: string;
  serial_number: string;
  asset_number: string;
  service_logs: ServiceLog[];
  calibrations: Calibration[];
  incident_reports: IncidentReport[];
  documentation: Documentation[];
  specification: Specification[];
  qr_code: string | null;
}

const DeviceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    make_model: "",
    manufacture: "",
    date_of_installation: "",
    warranty_until: "",
    asset_details: null,
    is_active: null,
    department: "",
    Room: "",
    next_calibration: "",
    serial_number: "",
    asset_number: "",
  });
  const [specData, setSpecData] = useState<SpecData>({});
  const [serviceData, setServiceData] = useState<ServiceData>({});
  const [docData, setDocData] = useState<DocData>({});
  const [incidentData, setIncidentData] = useState<IncidentData>({});
  const [maintenanceForm, setMaintenanceForm] = useState<MaintenanceForm>({
    service_date: "",
    service_type: "",
    engineer_id: "",
    service_details: "",
    document: null,
  });
  const [calibrationForm, setCalibrationForm] = useState<CalibrationForm>({
    calibration_date: new Date(),
    next_calibration: undefined,
    notes: "",
    engineer_id: "",
    document: null,
  });
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [showCalibrationForm, setShowCalibrationForm] = useState(false);

  const hospitalId = localStorage.getItem("hospitalid");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchDevice = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/${hospitalId}/devices/${id}/`, { headers });
      setDevice(response.data);
      setFormData({
        name: response.data.name || "",
        make_model: response.data.make_model || "",
        manufacture: response.data.manufacture || "",
        date_of_installation: response.data.date_of_installation || "",
        warranty_until: response.data.warranty_until || "",
        asset_details: response.data.asset_details || null,
        is_active: response.data.is_active || null,
        department: response.data.department || "",
        Room: response.data.Room || "",
        next_calibration: response.data.next_calibration || "",
        serial_number: response.data.serial_number || "",
        asset_number: response.data.asset_number || "",
      });
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error.response?.data);
      toast({
        title: "Error",
        description: `${error.response?.data.detail}` || 'Failed to load data',
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleDownloadQR = () => {
    if (device?.qr_code) {
      const link = document.createElement("a");
      link.href = device.qr_code;
      link.download = `device_${device.id}_qr.png`;
      link.click();
    }
  };
  const handlePrintQR = () => {
    if (device?.qr_code) {
      const printWindow = window.open(device.qr_code);
      printWindow?.print();
    }
  };

  useEffect(() => {
    if (!token || !hospitalId || !id) {
      navigate("/login");
      return;
    }
    fetchDevice();

    const fetchTechnicians = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/hospitals/${hospitalId}/employees/`, { headers });
        setTechnicians(res.data.map((e: Employee) => ({ id: e.id, name: e.name })));
      } catch (error) {
        console.error("Fetch technicians error:", error);
      }
    };
    fetchTechnicians();
  }, [id, hospitalId, token, navigate]);

  const handleEdit = (tab: string) => {
    setEditing(tab);
  };

  const handleSave = async (tab: string) => {
    try {
      if (tab === "overview") {
        const payload = { ...formData };
        // No need to delete serial_number and asset_number since they’re optional and not editable
        await axios.patch(`${baseUrl}/api/${hospitalId}/devices/${id}/`, payload, { headers });
      } else if (tab === "specifications") {
        await axios.post(`${baseUrl}/api/${hospitalId}/devices/${id}/specifications/`, specData, { headers });
      } else if (tab === "maintenance") {
        const payload = {
          ...serviceData,
          service_date: serviceData.service_date || new Date().toISOString().split("T")[0],
        };
        await axios.post(`${baseUrl}/api/${hospitalId}/devices/${id}/service-logs/`, payload, { headers });
      } else if (tab === "documentation") {
        const payload = {
          ...docData,
          last_updated: docData.last_updated || new Date().toISOString().split("T")[0],
        };
        await axios.post(`${baseUrl}/api/${hospitalId}/devices/${id}/documentation/`, payload, { headers });
      } else if (tab === "usage") {
        const payload = {
          ...incidentData,
          incident_date: incidentData.incident_date || new Date().toISOString().split("T")[0],
        };
        await axios.post(`${baseUrl}/api/${hospitalId}/devices/${id}/incident-reports/`, payload, { headers });
      }
      await fetchDevice();
      setEditing(null);
      setSpecData({});
      setServiceData({});
      setDocData({});
      setIncidentData({});
      toast({ title: "Success", description: `${tab} updated successfully.` });
    } catch (error) {
      console.error("Save error:", error.response?.data);
      toast({
        title: "Error",
        description: error.response?.data?.detail || `Failed to update ${tab}.`,
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSpecChange = (field: keyof SpecData, value: string) => {
    setSpecData((prev) => ({ ...prev, [field]: value }));
  };

  const handleServiceChange = (field: keyof ServiceData, value: string | number) => {
    setServiceData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDocChange = (field: keyof DocData, value: string) => {
    setDocData((prev) => ({ ...prev, [field]: value }));
  };

  const handleIncidentChange = (field: keyof IncidentData, value: string | number) => {
    setIncidentData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMaintenanceChange = (field: keyof MaintenanceForm, value: string | File | null) => {
    setMaintenanceForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCalibrationChange = (field: keyof CalibrationForm, value: string | Date | undefined | File | null) => {
    setCalibrationForm((prev) => ({ ...prev, [field]: value }));
  };

  const scheduleMaintenance = async () => {
    try {
      const formDataPayload = new FormData();
      formDataPayload.append("service_date", maintenanceForm.service_date || new Date().toISOString().split("T")[0]);
      formDataPayload.append("service_type", maintenanceForm.service_type);
      formDataPayload.append("engineer_id", maintenanceForm.engineer_id);
      formDataPayload.append("service_details", maintenanceForm.service_details);
      formDataPayload.append("device", device!.id);
      if (maintenanceForm.document) {
        formDataPayload.append("document", maintenanceForm.document);
      }

      await axios.post(`${baseUrl}/api/${hospitalId}/devices/${id}/service-logs/`, formDataPayload, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });
      toast({ title: "Success", description: "Maintenance scheduled successfully." });
      fetchDevice();
      setMaintenanceForm({ service_date: "", service_type: "", engineer_id: "", service_details: "", document: null });
      setShowMaintenanceForm(false);
    } catch (error) {
      console.error("Schedule maintenance error:", error.response?.data);
      toast({ title: "Error", description: "Failed to schedule maintenance.", variant: "destructive" });
    }
  };

  const scheduleCalibration = async () => {
    try {
      const formDataPayload = new FormData();
      formDataPayload.append("calibration_date", format(calibrationForm.calibration_date, "yyyy-MM-dd'T'HH:mm:ss"));
      formDataPayload.append("next_calibration", calibrationForm.next_calibration ? format(calibrationForm.next_calibration, "yyyy-MM-dd") : "");
      formDataPayload.append("notes", calibrationForm.notes);
      formDataPayload.append("engineer_id", calibrationForm.engineer_id || "");
      formDataPayload.append("device", device!.id);
      if (calibrationForm.document) {
        formDataPayload.append("document", calibrationForm.document);
      }

      await axios.post(`${baseUrl}/api/${hospitalId}/devices/${id}/calibrations/`, formDataPayload, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });
      toast({ title: "Success", description: "Calibration scheduled successfully." });
      fetchDevice();
      setCalibrationForm({ calibration_date: new Date(), next_calibration: undefined, notes: "", engineer_id: "", document: null });
      setShowCalibrationForm(false);
    } catch (error) {
      console.error("Schedule calibration error:", error.response?.data);
      toast({ title: "Error", description: "Failed to schedule calibration.", variant: "destructive" });
    }
  };

  if (loading) {
    return <PageContainer><p>Loading...</p></PageContainer>;
  }

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
          <Button variant="outline" size="sm" onClick={() => navigate("/devices")} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{device.make_model || "Unknown Device"}</h1>
            <p className="text-muted-foreground">
              {device.manufacture || "N/A"} • Serial: {device.serial_number || "N/A"} • ID: {device.id || "N/A"}
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
                device.is_active === "Operational" ? "text-green-500" : 
                device.is_active === "Needs_Calibration" ? "text-amber-500" : 
                device.is_active === "Under_Maintenance" ? "text-red-500" : "text-gray-500"
              }`}>
                {device.is_active || "N/A"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Condition</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{device.asset_details || "N/A"}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{device.Room || "N/A"}</div>
              <div className="text-muted-foreground">{device.department || "N/A"}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Next Calibration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {device.next_calibration ? new Date(device.next_calibration).toLocaleDateString() : "N/A"}
              </div>
              <div className="text-muted-foreground">
                {device.next_calibration && new Date(device.next_calibration) > new Date() 
                  ? `In ${Math.ceil((new Date(device.next_calibration).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days` 
                  : device.next_calibration ? "Overdue" : ""}
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
              Incident Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Device Information</CardTitle>
                <CardDescription>Detailed information about this {device.make_model || "device"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-muted-foreground mb-2">General Information</h3>
                      <dl className="grid grid-cols-2 gap-2">
                        <dt className="text-muted-foreground">Name:</dt>
                        <dd className="font-medium">
                          {editing === "overview" ? (
                            <Input
                              value={formData.name || ""}
                              onChange={(e) => handleInputChange("name", e.target.value)}
                            />
                          ) : (
                            device.name || "N/A"
                          )}
                        </dd>
                        <dt className="text-muted-foreground">Model:</dt>
                        <dd className="font-medium">
                          {editing === "overview" ? (
                            <Input
                              value={formData.make_model || ""}
                              onChange={(e) => handleInputChange("make_model", e.target.value)}
                            />
                          ) : (
                            device.make_model || "N/A"
                          )}
                        </dd>
                        <dt className="text-muted-foreground">Manufacturer:</dt>
                        <dd className="font-medium">
                          {editing === "overview" ? (
                            <Input
                              value={formData.manufacture || ""}
                              onChange={(e) => handleInputChange("manufacture", e.target.value)}
                            />
                          ) : (
                            device.manufacture || "N/A"
                          )}
                        </dd>
                        <dt className="text-muted-foreground">Serial Number:</dt>
                        <dd className="font-medium">{device.serial_number || "N/A"}</dd>
                        <dt className="text-muted-foreground">Asset Number:</dt>
                        <dd className="font-medium">{device.asset_number || "N/A"}</dd>
                      </dl>
                    </div>
                    <div>
                      <h3 className="font-medium text-muted-foreground mb-2">Location</h3>
                      <dl className="grid grid-cols-2 gap-2">
                        <dt className="text-muted-foreground">Department:</dt>
                        <dd className="font-medium">
                          {editing === "overview" ? (
                            <Input
                              value={formData.department || ""}
                              onChange={(e) => handleInputChange("department", e.target.value)}
                            />
                          ) : (
                            device.department || "N/A"
                          )}
                        </dd>
                        <dt className="text-muted-foreground">Room:</dt>
                        <dd className="font-medium">
                          {editing === "overview" ? (
                            <Input
                              value={formData.Room || ""}
                              onChange={(e) => handleInputChange("Room", e.target.value)}
                            />
                          ) : (
                            device.Room || "N/A"
                          )}
                        </dd>
                        {device.qr_code && (
                        <div className="flex flex-col items-center space-y-2">
                          <img
                            src={device.qr_code}
                            alt={`QR Code for ${device.make_model}`}
                            className="w-24 h-24 object-contain border rounded-md"
                          />
                        </div>
                      )}
                      </dl>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-muted-foreground mb-2">Purchase Information</h3>
                      <dl className="grid grid-cols-2 gap-2">
                        <dt className="text-muted-foreground">Installation Date:</dt>
                        <dd className="font-medium">
                          {editing === "overview" ? (
                            <Input
                              value={formData.date_of_installation || ""}
                              onChange={(e) => handleInputChange("date_of_installation", e.target.value)}
                              placeholder="YYYY-MM-DD"
                            />
                          ) : (
                            device.date_of_installation ? new Date(device.date_of_installation).toLocaleDateString() : "N/A"
                          )}
                        </dd>
                        <dt className="text-muted-foreground">Warranty Until:</dt>
                        <dd className="font-medium">
                          {editing === "overview" ? (
                            <Input
                              value={formData.warranty_until || ""}
                              onChange={(e) => handleInputChange("warranty_until", e.target.value)}
                              placeholder="YYYY-MM-DD"
                            />
                          ) : (
                            device.warranty_until ? new Date(device.warranty_until).toLocaleDateString() : "N/A"
                          )}
                        </dd>
                      </dl>
                    </div>
                    <div>
                      <h3 className="font-medium text-muted-foreground mb-2">Status</h3>
                      <dl className="grid grid-cols-2 gap-2">
                        <dt className="text-muted-foreground">Current Status:</dt>
                        <dd className="font-medium">
                          {editing === "overview" ? (
                            <Input
                              value={formData.is_active || ""}
                              onChange={(e) => handleInputChange("is_active", e.target.value)}
                            />
                          ) : (
                            device.is_active || "N/A"
                          )}
                        </dd>
                        <dt className="text-muted-foreground">Condition:</dt>
                        <dd className="font-medium">
                          {editing === "overview" ? (
                            <Input
                              value={formData.asset_details || ""}
                              onChange={(e) => handleInputChange("asset_details", e.target.value)}
                            />
                          ) : (
                            device.asset_details || "N/A"
                          )}
                        </dd>
                        <dt className="text-muted-foreground">Next Calibration:</dt>
                        <dd className="font-medium">
                          {device.next_calibration ? new Date(device.next_calibration).toLocaleDateString() : "N/A"}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                {editing === "overview" ? (
                  <Button onClick={() => handleSave("overview")}>Save Changes</Button>
                ) : (
                  <Button variant="outline" onClick={() => handleEdit("overview")}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleDownloadQR}>
                <Download className="mr-2 h-4 w-4" />
                Download QR
              </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
                <CardDescription>Technical details for this {device.make_model || "device"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {editing === "specifications" ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-muted-foreground">Power Supply</label>
                        <Input value={specData.power_supply || ""} onChange={(e) => handleSpecChange("power_supply", e.target.value)} />
                      </div>
                      <div>
                        <label className="text-muted-foreground">Battery Type</label>
                        <Input value={specData.battery_type || ""} onChange={(e) => handleSpecChange("battery_type", e.target.value)} />
                      </div>
                      <div>
                        <label className="text-muted-foreground">Battery Life</label>
                        <Input value={specData.battery_life || ""} onChange={(e) => handleSpecChange("battery_life", e.target.value)} />
                      </div>
                      <div>
                        <label className="text-muted-foreground">Weight</label>
                        <Input value={specData.weight || ""} onChange={(e) => handleSpecChange("weight", e.target.value)} />
                      </div>
                      <div>
                        <label className="text-muted-foreground">Dimensions</label>
                        <Input value={specData.dimensions || ""} onChange={(e) => handleSpecChange("dimensions", e.target.value)} />
                      </div>
                      <div>
                        <label className="text-muted-foreground">Connectivity Options</label>
                        <Input value={specData.conncetivity_options || ""} onChange={(e) => handleSpecChange("conncetivity_options", e.target.value)} />
                      </div>
                      <div>
                        <label className="text-muted-foreground">Certifications</label>
                        <Input value={specData.certifications || ""} onChange={(e) => handleSpecChange("certifications", e.target.value)} />
                      </div>
                    </div>
                  ) : device.specification.length > 0 ? (
                    <div className="space-y-6">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[200px]">Specification</TableHead>
                            <TableHead>Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(device.specification[0])
                            .filter(([key]) => key !== "id" && key !== "certifications")
                            .map(([key, value]) => (
                              <TableRow key={key}>
                                <TableCell className="font-medium capitalize">
                                  {key.replace(/([A-Z])/g, " $1").replace("conncetivity", "connectivity").trim()}
                                </TableCell>
                                <TableCell>{value || "N/A"}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                      <div>
                        <h3 className="text-lg font-medium mb-2">Certifications</h3>
                        <div className="flex flex-wrap gap-2">
                          {device.specification[0].certifications ? (
                            device.specification[0].certifications.split(", ").map((cert: string) => (
                              <div key={cert} className="bg-muted rounded-full px-3 py-1 text-sm">
                                {cert}
                              </div>
                            ))
                          ) : (
                            <p className="text-muted-foreground">No certifications available</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No specifications available. Click "Edit" to add.</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                {editing === "specifications" ? (
                  <Button onClick={() => handleSave("specifications")}>Save Changes</Button>
                ) : (
                  <Button variant="outline" onClick={() => handleEdit("specifications")}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance History & Scheduling</CardTitle>
                <CardDescription>View history and schedule maintenance or calibration for this {device.make_model || "device"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Buttons to toggle forms */}
                  <div className="flex gap-4 mt-6">
                    <Button onClick={() => setShowMaintenanceForm(!showMaintenanceForm)}>
                      {showMaintenanceForm ? "Hide" : "Schedule"} Maintenance
                    </Button>
                    <Button onClick={() => setShowCalibrationForm(!showCalibrationForm)}>
                      {showCalibrationForm ? "Hide" : "Schedule"} Calibration
                    </Button>
                  </div>

                  {/* Schedule Maintenance Form */}
                  {showMaintenanceForm && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-4">Schedule New Maintenance</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-muted-foreground">Service Date</label>
                          <Input
                            type="date"
                            value={maintenanceForm.service_date}
                            onChange={(e) => handleMaintenanceChange("service_date", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-muted-foreground">Service Type</label>
                          <Select onValueChange={(value) => handleMaintenanceChange("service_type", value)}>
                            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Preventive">Preventive</SelectItem>
                              <SelectItem value="Repair">Repair</SelectItem>
                              <SelectItem value="Inspection">Inspection</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-muted-foreground">Engineer</label>
                          <Select onValueChange={(value) => handleMaintenanceChange("engineer_id", value)}>
                            <SelectTrigger><SelectValue placeholder="Select engineer" /></SelectTrigger>
                            <SelectContent>
                              {technicians.map((tech) => (
                                <SelectItem key={tech.id} value={tech.id}>{tech.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <label className="text-muted-foreground">Details</label>
                          <Textarea
                            value={maintenanceForm.service_details}
                            onChange={(e) => handleMaintenanceChange("service_details", e.target.value)}
                            placeholder="Add notes or details"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-muted-foreground">Upload Document (Image/PDF)</label>
                          <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleMaintenanceChange("document", e.target.files?.[0] || null)}
                          />
                        </div>
                      </div>
                      <Button className="mt-4" onClick={scheduleMaintenance}>Schedule Maintenance</Button>
                    </div>
                  )}

                  {/* Schedule Calibration Form */}
                  {showCalibrationForm && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-4">Schedule New Calibration</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-muted-foreground">Calibration Date</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {calibrationForm.calibration_date ? format(calibrationForm.calibration_date, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={calibrationForm.calibration_date}
                                onSelect={(date) => date && handleCalibrationChange("calibration_date", date)}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <label className="text-muted-foreground">Next Calibration Date</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {calibrationForm.next_calibration ? format(calibrationForm.next_calibration, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={calibrationForm.next_calibration}
                                onSelect={(date) => date && handleCalibrationChange("next_calibration", date)}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <label className="text-muted-foreground">Engineer</label>
                          <Select onValueChange={(value) => handleCalibrationChange("engineer_id", value)}>
                            <SelectTrigger><SelectValue placeholder="Select engineer" /></SelectTrigger>
                            <SelectContent>
                              {technicians.map((tech) => (
                                <SelectItem key={tech.id} value={tech.id}>{tech.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <label className="text-muted-foreground">Notes</label>
                          <Textarea
                            value={calibrationForm.notes}
                            onChange={(e) => handleCalibrationChange("notes", e.target.value)}
                            placeholder="Add notes"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-muted-foreground">Upload Document (Image/PDF)</label>
                          <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleCalibrationChange("document", e.target.files?.[0] || null)}
                          />
                        </div>
                      </div>
                      <Button className="mt-4" onClick={scheduleCalibration}>Schedule Calibration</Button>
                    </div>
                  )}
                  {editing === "maintenance" ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-muted-foreground">Service Date</label>
                        <Input
                          type="date"
                          value={serviceData.service_date || ""}
                          onChange={(e) => handleServiceChange("service_date", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-muted-foreground">Service Type</label>
                        <Input value={serviceData.service_type || ""} onChange={(e) => handleServiceChange("service_type", e.target.value)} />
                      </div>
                      <div>
                        <label className="text-muted-foreground">Engineer ID</label>
                        <Input
                          type="number"
                          value={serviceData.engineer_id || ""}
                          onChange={(e) => handleServiceChange("engineer_id", parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-muted-foreground">Service Details</label>
                        <Input value={serviceData.service_details || ""} onChange={(e) => handleServiceChange("service_details", e.target.value)} />
                      </div>
                    </div>
                  ) : device.service_logs.length > 0 || device.calibrations.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Engineer</TableHead>
                          <TableHead>Details/Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {device.service_logs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell>{log.service_date ? new Date(log.service_date).toLocaleDateString() : "N/A"}</TableCell>
                            <TableCell>{log.service_type || "N/A"}</TableCell>
                            <TableCell>{log.engineer?.name || "N/A"}</TableCell>
                            <TableCell>{log.service_details || "N/A"}</TableCell>
                          </TableRow>
                        ))}
                        {device.calibrations.map((cal) => (
                          <TableRow key={cal.id}>
                            <TableCell>{cal.calibration_date ? new Date(cal.calibration_date).toLocaleDateString() : "N/A"}</TableCell>
                            <TableCell>Calibration</TableCell>
                            <TableCell>{cal.engineer?.name || "N/A"}</TableCell>
                            <TableCell>{cal.notes || cal.result || "N/A"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground">No maintenance history available.</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  className="flex gap-2" 
                  onClick={() => navigate("/ticket-raise", { state: { deviceId: device.id, deviceName: device.make_model }})}
                >
                  <Ticket size={16} />
                  Report Issue
                </Button>
                {editing === "maintenance" ? (
                  <Button onClick={() => handleSave("maintenance")}>Save Changes</Button>
                ) : (
                  <Button variant="outline" onClick={() => handleEdit("maintenance")}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit History
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="documentation" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Documentation</CardTitle>
                <CardDescription>Available documentation for this {device.make_model || "device"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {editing === "documentation" ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-muted-foreground">Document URL</label>
                        <Input value={docData.document || ""} onChange={(e) => handleDocChange("document", e.target.value)} />
                      </div>
                      <div>
                        <label className="text-muted-foreground">Type</label>
                        <Input value={docData.types || ""} onChange={(e) => handleDocChange("types", e.target.value)} />
                      </div>
                      <div>
                        <label className="text-muted-foreground">Last Updated</label>
                        <Input
                          type="date"
                          value={docData.last_updated || ""}
                          onChange={(e) => handleDocChange("last_updated", e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-muted-foreground">Storage Location</label>
                        <Input value={docData.storage_location || ""} onChange={(e) => handleDocChange("storage_location", e.target.value)} />
                      </div>
                    </div>
                  ) : device.documentation.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Document</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Last Updated</TableHead>
                          <TableHead>Location</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {device.documentation.map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell>{doc.document ? <a href={doc.document} target="_blank" rel="noopener noreferrer">{doc.document}</a> : "N/A"}</TableCell>
                            <TableCell>{doc.types || "N/A"}</TableCell>
                            <TableCell>{doc.last_updated ? new Date(doc.last_updated).toLocaleDateString() : "N/A"}</TableCell>
                            <TableCell>{doc.storage_location || "N/A"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground">No documentation available. Click "Edit" to add.</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                {editing === "documentation" ? (
                  <Button onClick={() => handleSave("documentation")}>Save Changes</Button>
                ) : (
                  <Button variant="outline" onClick={() => handleEdit("documentation")}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Incident Reports</CardTitle>
                <CardDescription>Incident history for this {device.make_model || "device"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {editing === "usage" ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-muted-foreground">Incident Date</label>
                        <Input
                          type="date"
                          value={incidentData.incident_date || ""}
                          onChange={(e) => handleIncidentChange("incident_date", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-muted-foreground">Incident Type</label>
                        <Input value={incidentData.incident_type || ""} onChange={(e) => handleIncidentChange("incident_type", e.target.value)} />
                      </div>
                      <div>
                        <label className="text-muted-foreground">Reported By ID</label>
                        <Input
                          type="number"
                          value={incidentData.reported_by_id || ""}
                          onChange={(e) => handleIncidentChange("reported_by_id", parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <label className="text-muted-foreground">Related Employee ID</label>
                        <Input
                          type="number"
                          value={incidentData.related_employee_id || ""}
                          onChange={(e) => handleIncidentChange("related_employee_id", parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-muted-foreground">Description</label>
                        <Input value={incidentData.description || ""} onChange={(e) => handleIncidentChange("description", e.target.value)} />
                      </div>
                    </div>
                  ) : device.incident_reports.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Reported By</TableHead>
                          <TableHead>Related Employee</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {device.incident_reports.map((incident) => (
                          <TableRow key={incident.id}>
                            <TableCell>{incident.incident_date ? new Date(incident.incident_date).toLocaleDateString() : "N/A"}</TableCell>
                            <TableCell>{incident.incident_type || "N/A"}</TableCell>
                            <TableCell>{incident.reported_by?.user.name || "N/A"}</TableCell>
                            <TableCell>{incident.related_employee?.user.name || "N/A"}</TableCell>
                            <TableCell>{incident.description || "N/A"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground">No incident reports available. Click "Edit" to add.</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  className="flex gap-2" 
                  onClick={() => navigate("/ticket-raise", { state: { deviceId: device.id, deviceName: device.make_model } })}
                >
                  <Ticket size={16} />
                  Report New Incident
                </Button>
                {editing === "usage" ? (
                  <Button onClick={() => handleSave("usage")}>Save Changes</Button>
                ) : (
                  <Button variant="outline" onClick={() => handleEdit("usage")}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default DeviceDetail;
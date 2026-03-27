import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, ScanLine } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { baseUrl } from "@/utils/apiconfig";

interface Supplier {
  id: number;
  name: string;
}

const DeviceOrder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [installationDate, setInstallationDate] = useState<Date | undefined>();
  const [warrantyDate, setWarrantyDate] = useState<Date | undefined>();
  const [isNfcSupported, setIsNfcSupported] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    make_model: "",
    manufacture: "",
    serial_number: "",
    nfc_uuid: "", // Field for NFC UUID
    asset_number: "",
    asset_details: "Excellent",
    is_active: "Operational",
    department: "",
    Room: "",
  });

  const hospitalId = localStorage.getItem("hospital_id");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // Fetch suppliers
  const { data: suppliers = [], isLoading: suppliersLoading } = useQuery<Supplier[], AxiosError>({
    queryKey: ['suppliers', hospitalId],
    queryFn: () =>
      axios
        .get(`${baseUrl}/api/${hospitalId}/suppliers/`, { headers })
        .then((res) => res.data),
    enabled: !!token && !!hospitalId,
  });

  // Check for Web NFC support
  useEffect(() => {
    if ("NDEFReader" in window) {
      setIsNfcSupported(true);
    } else {
      console.warn("Web NFC is not supported in this browser.");
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNfcScan = async () => {
    if (!isNfcSupported) {
      toast({
        title: "Error",
        description: "NFC scanning is not supported in this browser.",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    try {
      const ndef = new window.NDEFReader();
      await ndef.scan();
      toast({
        title: "Scanning",
        description: "Please tap an NFC tag.",
      });

      ndef.onreading = ({ message }) => {
        let nfcUuid = null;
        for (const record of message.records) {
          if (record.recordType === "text") {
            const textDecoder = new TextDecoder(record.encoding);
            nfcUuid = textDecoder.decode(record.data);
            break;
          }
        }

        if (nfcUuid) {
          setFormData((prev) => ({ ...prev, nfc_uuid: nfcUuid }));
          toast({
            title: "Success",
            description: `NFC UUID ${nfcUuid} loaded.`,
          });
        } else {
          toast({
            title: "Error",
            description: "No valid UUID found on NFC tag.",
            variant: "destructive",
          });
        }
        setIsScanning(false);
      };

      ndef.onreadingerror = () => {
        toast({
          title: "Error",
          description: "Failed to read NFC tag. Please try again.",
          variant: "destructive",
        });
        setIsScanning(false);
      };
    } catch (error) {
      console.error("NFC scan error:", error.name, error.message);
      toast({
        title: "Error",
        description: `Failed to start NFC scan: ${error.message}`,
        variant: "destructive",
      });
      setIsScanning(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !hospitalId) {
      toast({ title: "Error", description: "Please log in and select a hospital.", variant: "destructive" });
      navigate("/login");
      return;
    }
    if (!formData.make_model || !formData.serial_number || !formData.asset_number) {
      toast({ title: "Error", description: "Please fill in all required fields: Device Name, Serial Number, and Asset Number.", variant: "destructive" });
      return;
    }

    const deviceData = {
      name: formData.name,
      make_model: formData.make_model,
      manufacture: formData.manufacture || null,
      serial_number: formData.serial_number,
      nfc_uuid: formData.nfc_uuid || null, // Include NFC UUID
      date_of_installation: installationDate ? format(installationDate, "yyyy-MM-dd") : null,
      warranty_until: warrantyDate ? format(warrantyDate, "yyyy-MM-dd") : null,
      asset_number: formData.asset_number,
      asset_details: formData.asset_details,
      is_active: formData.is_active,
      department: formData.department || null,
      Room: formData.Room || null,
    };

    try {
      await axios.post(`${baseUrl}/api/${hospitalId}/devices/`, deviceData, { headers });
      toast({
        title: "Success",
        description: "Device has been added successfully.",
      });
      setTimeout(() => navigate("/devices"), 1000);
    } catch (error) {
      console.error("Add device error:", error.response?.data);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to add device. Ensure NFC UUID is unique if provided.",
        variant: "destructive",
      });
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Add New Device</h1>
            <p className="text-muted-foreground">Register a new device in the system</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/devices")}>
            Back to Devices
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Device Information</CardTitle>
            <CardDescription>Fill in the details for the new device</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Device Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Defibrillator"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="make_model">Model Name *</Label>
                  <Input
                    id="make_model"
                    placeholder="e.g., MRI Scanner"
                    value={formData.make_model}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manufacture">Supplier</Label>
                  {suppliersLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Select
                      onValueChange={(value) => handleSelectChange("manufacture", value)}
                      value={formData.manufacture}
                    >
                      <SelectTrigger id="manufacture">
                        <SelectValue placeholder="Select manufacturer" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.length === 0 ? (
                          <SelectItem value="none" disabled>No suppliers available</SelectItem>
                        ) : (
                          suppliers.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.name}>
                              {supplier.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serial_number">Serial Number *</Label>
                  <Input
                    id="serial_number"
                    placeholder="e.g., SN12345"
                    value={formData.serial_number}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nfc_uuid">NFC UUID (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="nfc_uuid"
                      placeholder="Scan NFC tag to fill"
                      value={formData.nfc_uuid}
                      onChange={handleInputChange}
                      disabled={isScanning}
                    />
                    <Button
                      type="button"
                      onClick={handleNfcScan}
                      disabled={isScanning || !isNfcSupported}
                      className="flex gap-2"
                    >
                      <ScanLine size={16} />
                      {isScanning ? "Scanning..." : "Scan NFC"}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="asset_number">Asset Number *</Label>
                  <Input
                    id="asset_number"
                    placeholder="e.g., ASSET-001"
                    value={formData.asset_number}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Installation Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {installationDate ? format(installationDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={installationDate}
                        onSelect={setInstallationDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Warranty Until</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {warrantyDate ? format(warrantyDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={warrantyDate}
                        onSelect={setWarrantyDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="asset_details">Condition</Label>
                  <Select
                    value={formData.asset_details}
                    onValueChange={(value) => handleSelectChange("asset_details", value)}
                  >
                    <SelectTrigger id="asset_details">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="is_active">Status</Label>
                  <Select
                    value={formData.is_active}
                    onValueChange={(value) => handleSelectChange("is_active", value)}
                  >
                    <SelectTrigger id="is_active">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Operational">Operational</SelectItem>
                      <SelectItem value="Needs_Calibration">Needs Calibration</SelectItem>
                      <SelectItem value="Under_Maintenance">Under Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    placeholder="e.g., Radiology"
                    value={formData.department}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="Room">Room</Label>
                  <Input
                    id="Room"
                    placeholder="e.g., Room 101"
                    value={formData.Room}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => navigate("/devices")}>
                  Cancel
                </Button>
                <Button type="submit">Add Device</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default DeviceOrder;
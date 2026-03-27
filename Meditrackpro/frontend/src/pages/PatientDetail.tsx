import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Activity,
  Heart,
  Brain,
  Stethoscope,
  FileText,
  Pill,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { baseUrl } from "@/utils/apiconfig";
import "@google/model-viewer";

// TypeScript declaration for model-viewer (ensure this is in src/types/model-viewer.d.ts)


const PatientDetail = () => {
  const hospital_id = localStorage.getItem("hospitalid");
  const patient_id = localStorage.getItem("patientid");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [highlightedPart, setHighlightedPart] = useState(null); // Track highlighted part
  const modelViewerRef = useRef(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/hospitals/${hospital_id}/patients/${patient_id}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setPatient(response.data);
      } catch (error) {
        toast({
          title: "Error",
          description: error.response?.data?.detail || "Failed to fetch patient details.",
          variant: "destructive",
        });
      }
    };
    fetchPatient();
  }, [hospital_id, patient_id, toast]);

  // Handle model-viewer error event
  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (modelViewer) {
      const handleError = () => {
        toast({
          title: "Error",
          description: "Failed to load 3D model.",
          variant: "destructive",
        });
      };
      modelViewer.addEventListener("error", handleError);
      return () => {
        modelViewer.removeEventListener("error", handleError);
      };
    }
  }, [toast]);

  // Handle highlighting of body parts
  const handleHighlight = (part) => {
    setHighlightedPart(part);
    const modelViewer = modelViewerRef.current;
    if (modelViewer && modelViewer.model) {
      // Reset all materials
      modelViewer.model.materials.forEach((material) => {
        material.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 1]); // Reset to default
        material.setEmissiveFactor([0, 0, 0]); // No glow
      });

      // Map parts to mesh indices based on GLTF structure
      const materialIndices = {
        Brain: [15], // Schaedel
        SpinalCord: [18, 19], // HWS, LWS
        PeripheralNerves: [6, 7, 10, 12, 14], // Oberarmknochen, Oberschenkelknochen, Schienbein, Speiche, Wadenbein
      }[part];

      if (materialIndices && materialIndices.length > 0) {
        materialIndices.forEach((index) => {
          if (modelViewer.model.materials[index]) {
            modelViewer.model.materials[index].setEmissiveFactor([1, 0, 0]); // Red glow
          }
        });

        // Adjust camera to focus on the part
        const cameraSettings = {
          Brain: "0deg 90deg 5m", // Focus on skull
          SpinalCord: "0deg 45deg 3m", // Focus on spine
          PeripheralNerves: "0deg 75deg 4m", // Focus on limbs
        }[part];
        if (cameraSettings) {
          modelViewer.setAttribute("camera-orbit", cameraSettings);
        }
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await axios.delete(`${baseUrl}/api/hospitals/${hospital_id}/patients/${patient_id}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast({
          title: "Success",
          description: "Patient deleted successfully.",
        });
        navigate(`/patients`);
      } catch (error) {
        toast({
          title: "Error",
          description: error.response?.data?.detail || "Failed to delete patient.",
          variant: "destructive",
        });
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Active: { color: "bg-red-50 text-red-700 border-red-200", icon: AlertTriangle },
      Controlled: { color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: Clock },
      Resolved: { color: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle },
      Completed: { color: "bg-blue-50 text-blue-700 border-blue-200", icon: CheckCircle },
      Scheduled: { color: "bg-purple-50 text-purple-700 border-purple-200", icon: Calendar },
      Canceled: { color: "bg-gray-50 text-gray-700 border-gray-200", icon: Clock },
    };

    const config = statusConfig[status] || statusConfig.Active;
    const Icon = config.icon;

    return (
      <Badge variant="outline" className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  if (!patient) return <div>Loading...</div>;

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const allergies = patient.allergies ? patient.allergies.split(",").map((a) => a.trim()) : [];
  const latestVitals = patient.vitals && patient.vitals.length > 0 ? patient.vitals[0] : null;

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate(`/hospitals/${hospital_id}/patients`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Patients
            </Button>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg font-semibold">
                  {getInitials(`${patient.first_name} ${patient.last_name}`)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{`${patient.first_name} ${patient.last_name}`}</h1>
                <p className="text-muted-foreground">Patient ID: {patient.patient_id}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Medical Records
            </Button>
            <Button onClick={() => navigate(`/hospitals/${hospital_id}/patients/${patient_id}/appointments/new`)}>
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Appointment
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Patient
            </Button>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-semibold">{calculateAge(patient.date_of_birth)} years</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Blood Type</p>
                  <p className="font-semibold">{patient.blood_type || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-semibold">{patient.phone_number}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Allergies</p>
                  <p className="font-semibold">{allergies.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="medical">Medical History</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="nervous-system">Nervous System</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5" />
                    Current Vitals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {latestVitals ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Heart Rate</p>
                        <p className="text-2xl font-bold text-red-500">{latestVitals.heart_rate || "N/A"} bpm</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Blood Pressure</p>
                        <p className="text-2xl font-bold text-blue-500">{latestVitals.blood_pressure || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Temperature</p>
                        <p className="text-2xl font-bold text-orange-500">{Math.round(latestVitals.temperature) || "N/A"}°F</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">O2 Saturation</p>
                        <p className="text-2xl font-bold text-green-500">{latestVitals.oxygen_saturation || "N/A"}%</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No vitals recorded.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Patient Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{patient.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{patient.address || patient.city || patient.state || patient.postal_code || patient.country ? `${patient.address || ""}, ${patient.city || ""}, ${patient.state || ""} ${patient.postal_code || ""}, ${patient.country || ""}`.trim() : "N/A"}</span>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Emergency Contact</h4>
                    {patient.emergency_contacts && patient.emergency_contacts.length > 0 ? (
                      <>
                        <p className="text-sm">{patient.emergency_contacts[0].name} ({patient.emergency_contacts[0].relationship})</p>
                        <p className="text-sm text-muted-foreground">{patient.emergency_contacts[0].phone}</p>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">No emergency contact provided.</p>
                    )}
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Allergies</h4>
                    {allergies.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {allergies.map((allergy, index) => (
                          <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No allergies recorded.</p>
                    )}
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Insurance Information</h4>
                    {patient.insurance_provider || patient.policy_number ? (
                      <>
                        <p><strong>Provider:</strong> {patient.insurance_provider || "N/A"}</p>
                        <p><strong>Policy Number:</strong> {patient.policy_number || "N/A"}</p>
                        <p><strong>Group Number:</strong> {patient.group_number || "N/A"}</p>
                        <p><strong>Policy Holder:</strong> {patient.policy_holder || "N/A"}</p>
                        <p><strong>Relationship:</strong> {patient.relationship_to_holder || "N/A"}</p>
                        <p><strong>Coverage Start:</strong> {patient.coverage_start_date || "N/A"}</p>
                        <p><strong>Coverage End:</strong> {patient.coverage_end_date || "N/A"}</p>
                        <p><strong>Secondary Insurance:</strong> {patient.has_secondary_insurance ? "Yes" : "No"}</p>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">No insurance details provided.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="medical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Medical History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patient.medical_history && patient.medical_history.length > 0 ? (
                    patient.medical_history.map((condition, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{condition.condition}</h4>
                          <p className="text-sm text-muted-foreground">Diagnosed: {condition.diagnosed_date}</p>
                        </div>
                        {getStatusBadge(condition.status)}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No medical history recorded.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5" />
                  Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patient.medications && patient.medications.length > 0 ? (
                    patient.medications.map((medication, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{medication.name}</h4>
                          <Badge variant="outline">{medication.dosage}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{medication.frequency}</p>
                        <p className="text-sm">
                          Prescribed by: {medication.prescribed_by ? `${medication.prescribed_by.user.first_name} ${medication.prescribed_by.user.last_name}` : "N/A"}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No medications recorded.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nervous-system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  3D Nervous System Visualization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Interactive 3D model of the human body. Click the buttons below to highlight specific parts.
                  </p>
                  {/* Highlight Buttons */}
                  <div className="flex gap-2 mb-4">
                    <Button
                      variant={highlightedPart === "Brain" ? "default" : "outline"}
                      onClick={() => handleHighlight("Brain")}
                    >
                      Brain
                    </Button>
                    <Button
                      variant={highlightedPart === "SpinalCord" ? "default" : "outline"}
                      onClick={() => handleHighlight("SpinalCord")}
                    >
                      Spinal Cord
                    </Button>
                    <Button
                      variant={highlightedPart === "PeripheralNerves" ? "default" : "outline"}
                      onClick={() => handleHighlight("PeripheralNerves")}
                    >
                      Peripheral Nerves
                    </Button>
                  </div>
                  {/* 3D Model Viewer */}
                  <div className="w-full h-[500px] border rounded-lg overflow-hidden">
                    <model-viewer
                      ref={modelViewerRef}
                      src="/models/model.gltf"
                      alt="3D model of the human body"
                      auto-rotate
                      camera-controls
                      shadow-intensity="1"
                      style={{ width: "100%", height: "100%" }}
                    >
                      <div slot="poster" className="flex items-center justify-center h-full bg-gray-100">
                        <p className="text-muted-foreground">Loading 3D model...</p>
                      </div>
                    </model-viewer>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2"></div>
                      <p className="font-semibold">Brain & Neurons</p>
                      <p className="text-sm text-muted-foreground">Central processing</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="w-4 h-4 bg-orange-500 rounded-full mx-auto mb-2"></div>
                      <p className="font-semibold">Spinal Cord</p>
                      <p className="text-sm text-muted-foreground">Main pathway</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                      <p className="font-semibold">Peripheral Nerves</p>
                      <p className="text-sm text-muted-foreground">Body connections</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appointment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patient.appointments && patient.appointments.length > 0 ? (
                    patient.appointments.map((appointment, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{appointment.type}</h4>
                          <p className="text-sm text-muted-foreground">
                            {appointment.appointment_date} at {appointment.appointment_time}
                          </p>
                          <p className="text-sm">
                            Dr. {appointment.doctor ? `${appointment.doctor.user.first_name} ${appointment.doctor.user.last_name}` : "N/A"}
                          </p>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No appointments recorded.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default PatientDetail;
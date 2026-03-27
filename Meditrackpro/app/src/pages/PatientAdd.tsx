import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { baseUrl } from "@/utils/apiconfig";

const PatientAdd = () => {
  const navigate = useNavigate();
  const hospital_id  = localStorage.getItem('hospital_id'); // Get hospital_id from localStorage
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    email: "",
    phone_number: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    blood_type: "",
    height: "",
    weight: "",
    primary_physician_id: "",
    allergies: "",
    medical_conditions: "",
    medications: "",
    insurance_provider: "",
    policy_number: "",
    group_number: "",
    policy_holder: "",
    relationship_to_holder: "",
    coverage_start_date: "",
    coverage_end_date: "",
    has_secondary_insurance: false,
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseUrl}/api/hospitals/${hospital_id}/patients/`,
        { ...formData, hospital: hospital_id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust based on your auth setup
          },
        }
      );
      toast({
        title: "Success",
        description: "Patient added successfully.",
      });
      setTimeout(() => navigate(`/patients`), 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to add patient.",
        variant: "destructive",
      });
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Add Patient</h1>
            <p className="text-muted-foreground">Add a new patient to the system</p>
          </div>
          <Button variant="outline" onClick={() => navigate(`/patients`)}>
            Back to Patients
          </Button>
        </div>

        <Card>
          <Tabs defaultValue="personal" className="w-full">
            <CardHeader>
              <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
                <CardTitle>Patient Information</CardTitle>
                <TabsList>
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="medical">Medical</TabsTrigger>
                  <TabsTrigger value="insurance">Insurance</TabsTrigger>
                </TabsList>
              </div>
              <CardDescription>Enter patient details to add them to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input id="first_name" placeholder="Enter first name" value={formData.first_name} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input id="last_name" placeholder="Enter last name" value={formData.last_name} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date_of_birth">Date of Birth</Label>
                      <Input id="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select onValueChange={(value) => handleSelectChange("gender", value)} value={formData.gender}>
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="patient@example.com" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone_number">Phone Number</Label>
                      <Input id="phone_number" placeholder="(555) 123-4567" value={formData.phone_number} onChange={handleChange} required />
                    </div>
                    <div className="col-span-1 space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea id="address" placeholder="Enter patient address" value={formData.address} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="Enter city" value={formData.city} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input id="state" placeholder="Enter state/province" value={formData.state} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postal_code">Postal Code</Label>
                      <Input id="postal_code" placeholder="Enter postal code" value={formData.postal_code} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select onValueChange={(value) => handleSelectChange("country", value)} value={formData.country}>
                        <SelectTrigger id="country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="India">India</SelectItem>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="medical" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="blood_type">Blood Type</Label>
                      <Select onValueChange={(value) => handleSelectChange("blood_type", value)} value={formData.blood_type}>
                        <SelectTrigger id="blood_type">
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input id="height" type="number" placeholder="Enter height" value={formData.height} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input id="weight" type="number" placeholder="Enter weight" value={formData.weight} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primary_physician_id">Primary Physician</Label>
                      <Select onValueChange={(value) => handleSelectChange("primary_physician_id", value)} value={formData.primary_physician_id}>
                        <SelectTrigger id="primary_physician_id">
                          <SelectValue placeholder="Select physician" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Fetch doctors dynamically from the backend */}
                          <SelectItem value="1">Dr. Smith</SelectItem> {/* Replace with API data */}
                          <SelectItem value="2">Dr. Johnson</SelectItem>
                          <SelectItem value="3">Dr. Williams</SelectItem>
                          <SelectItem value="4">Dr. Brown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-1 space-y-2 md:col-span-2">
                      <Label htmlFor="allergies">Allergies</Label>
                      <Textarea id="allergies" placeholder="List any allergies" value={formData.allergies} onChange={handleChange} />
                    </div>
                    <div className="col-span-1 space-y-2 md:col-span-2">
                      <Label htmlFor="medical_conditions">Medical Conditions</Label>
                      <Textarea id="medical_conditions" placeholder="List any medical conditions" value={formData.medical_conditions} onChange={handleChange} />
                    </div>
                    <div className="col-span-1 space-y-2 md:col-span-2">
                      <Label htmlFor="medications">Current Medications</Label>
                      <Textarea id="medications" placeholder="List current medications" value={formData.medications} onChange={handleChange} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="insurance" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="insurance_provider">Insurance Provider</Label>
                      <Input id="insurance_provider" placeholder="Enter insurance provider" value={formData.insurance_provider} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="policy_number">Policy Number</Label>
                      <Input id="policy_number" placeholder="Enter policy number" value={formData.policy_number} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="group_number">Group Number</Label>
                      <Input id="group_number" placeholder="Enter group number" value={formData.group_number} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="policy_holder">Policy Holder (if not self)</Label>
                      <Input id="policy_holder" placeholder="Enter policy holder name" value={formData.policy_holder} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="relationship_to_holder">Relationship to Policy Holder</Label>
                      <Select onValueChange={(value) => handleSelectChange("relationship_to_holder", value)} value={formData.relationship_to_holder}>
                        <SelectTrigger id="relationship_to_holder">
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="self">Self</SelectItem>
                          <SelectItem value="spouse">Spouse</SelectItem>
                          <SelectItem value="child">Child</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coverage_start_date">Coverage Start Date</Label>
                      <Input id="coverage_start_date" type="date" value={formData.coverage_start_date} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coverage_end_date">Coverage End Date</Label>
                      <Input id="coverage_end_date" type="date" value={formData.coverage_end_date} onChange={handleChange} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="has_secondary_insurance" checked={formData.has_secondary_insurance} onCheckedChange={(checked) => handleSelectChange("has_secondary_insurance", checked)} />
                      <Label htmlFor="has_secondary_insurance">Has Secondary Insurance</Label>
                    </div>
                  </div>
                </TabsContent>

                <div className="mt-6 flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => navigate(`/patients`)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Patient</Button>
                </div>
              </form>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </PageContainer>
  );
};

export default PatientAdd;
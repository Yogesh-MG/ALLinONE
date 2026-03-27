
import React from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const PatientAdddemo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success",
      description: "Patient added successfully.",
    });
    // In a real app, we would send data to the backend here
    setTimeout(() => navigate("/patients"), 1000);
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Add Patient</h1>
            <p className="text-muted-foreground">
              Add a new patient to the system
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/patients")}>
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
              <CardDescription>
                Enter patient details to add them to the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" placeholder="Enter first name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" placeholder="Enter last name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input id="dob" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select>
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
                      <Input id="email" type="email" placeholder="patient@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="(555) 123-4567" required />
                    </div>
                    <div className="col-span-1 space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea id="address" placeholder="Enter patient address" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="Enter city" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input id="state" placeholder="Enter state/province" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postal-code">Postal Code</Label>
                      <Input id="postal-code" placeholder="Enter postal code" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select defaultValue="us">
                        <SelectTrigger id="country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
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
                      <Label htmlFor="blood-type">Blood Type</Label>
                      <Select>
                        <SelectTrigger id="blood-type">
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a_pos">A+</SelectItem>
                          <SelectItem value="a_neg">A-</SelectItem>
                          <SelectItem value="b_pos">B+</SelectItem>
                          <SelectItem value="b_neg">B-</SelectItem>
                          <SelectItem value="ab_pos">AB+</SelectItem>
                          <SelectItem value="ab_neg">AB-</SelectItem>
                          <SelectItem value="o_pos">O+</SelectItem>
                          <SelectItem value="o_neg">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input id="height" type="number" placeholder="Enter height" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input id="weight" type="number" placeholder="Enter weight" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primary-physician">Primary Physician</Label>
                      <Select>
                        <SelectTrigger id="primary-physician">
                          <SelectValue placeholder="Select physician" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dr_smith">Dr. Smith</SelectItem>
                          <SelectItem value="dr_johnson">Dr. Johnson</SelectItem>
                          <SelectItem value="dr_williams">Dr. Williams</SelectItem>
                          <SelectItem value="dr_brown">Dr. Brown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-1 space-y-2 md:col-span-2">
                      <Label htmlFor="allergies">Allergies</Label>
                      <Textarea id="allergies" placeholder="List any allergies" />
                    </div>
                    <div className="col-span-1 space-y-2 md:col-span-2">
                      <Label htmlFor="medical-conditions">Medical Conditions</Label>
                      <Textarea
                        id="medical-conditions"
                        placeholder="List any medical conditions"
                      />
                    </div>
                    <div className="col-span-1 space-y-2 md:col-span-2">
                      <Label htmlFor="medications">Current Medications</Label>
                      <Textarea
                        id="medications"
                        placeholder="List current medications"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="insurance" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="insurance-provider">Insurance Provider</Label>
                      <Input
                        id="insurance-provider"
                        placeholder="Enter insurance provider"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="policy-number">Policy Number</Label>
                      <Input id="policy-number" placeholder="Enter policy number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="group-number">Group Number</Label>
                      <Input id="group-number" placeholder="Enter group number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="policy-holder">Policy Holder (if not self)</Label>
                      <Input
                        id="policy-holder"
                        placeholder="Enter policy holder name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="relationship">Relationship to Policy Holder</Label>
                      <Select>
                        <SelectTrigger id="relationship">
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
                      <Label htmlFor="coverage-start">Coverage Start Date</Label>
                      <Input id="coverage-start" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coverage-end">Coverage End Date</Label>
                      <Input id="coverage-end" type="date" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="secondary-insurance" />
                      <Label htmlFor="secondary-insurance">Has Secondary Insurance</Label>
                    </div>
                  </div>
                </TabsContent>

                <div className="mt-6 flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => navigate("/patients")}>
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

export default PatientAdddemo;

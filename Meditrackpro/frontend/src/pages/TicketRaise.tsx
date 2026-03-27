import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertTriangle, CheckCircle, FileText, Send, ScanLine } from "lucide-react";
import axios from "axios";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { baseUrl } from "@/utils/apiconfig";

const ticketFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title needs at least 3 characters." })
    .nonempty({ message: "Title cannot be empty, bro!" }),
  deviceId: z.string().optional(),
  nfcUuid: z.string().optional(), // New field for NFC UUID
  category: z.string({ required_error: "Please pick a category!" }),
  priority: z.string({ required_error: "Please select a priority level." }),
  description: z
    .string()
    .min(10, { message: "Description needs at least 10 characters." })
    .nonempty({ message: "Gotta describe the issue!" }),
  location: z.string().nonempty({ message: "Where’s this happening? Add a location." }),
});

type TicketFormValues = z.infer<typeof ticketFormSchema>;

const TicketRaise = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [isNfcSupported, setIsNfcSupported] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      title: "",
      deviceId: "",
      nfcUuid: "",
      category: "",
      priority: "medium",
      description: "",
      location: "",
    },
  });

  useEffect(() => {
    // Check if Web NFC is supported
    if ("NDEFReader" in window) {
      setIsNfcSupported(true);
    } else {
      console.warn("Web NFC is not supported in this browser.");
    }

    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${baseUrl}/api/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployeeId(response.data.employee_id);
        setFetchError(null);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setFetchError("Couldn’t fetch your profile. Please try again.");
        toast({
          title: "Error",
          description: "Failed to load user profile. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchUserProfile();
  }, []);

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

      ndef.onreading = async ({ message }) => {
        let nfcUuid = null;
        for (const record of message.records) {
          if (record.recordType === "text") {
            const textDecoder = new TextDecoder(record.encoding);
            nfcUuid = textDecoder.decode(record.data);
            break;
          }
        }

        if (nfcUuid) {
          try {
            const hospitalId = localStorage.getItem("hospitalid"); // Replace with dynamic hospital ID
            const response = await axios.get(
              `${baseUrl}/api/${hospitalId}/devices/nfc/${nfcUuid}/`,
              {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
              }
            );
            const deviceId = response.data.id;
            form.setValue("deviceId", deviceId.toString());
            form.setValue("nfcUuid", nfcUuid);
            toast({
              title: "Success",
              description: `Device ID ${deviceId} loaded from NFC tag.`,
            });
          } catch (error) {
            console.error("Error fetching device by NFC UUID:", error);
            toast({
              title: "Error",
              description: error.response?.data?.error || "No device found for this NFC tag.",
              variant: "destructive",
            });
          }
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
      console.error("NFC scan error:", error);
      toast({
        title: "Error",
        description: `${error}`,
        variant: "destructive",
      });
      setIsScanning(false);
    }
  };

  const onSubmit = async (data) => {
    if (!employeeId) {
      toast({
        title: "Error",
        description: "User profile not loaded. Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const hospitalId = localStorage.getItem("hospital_id") || "1"; // Replace with dynamic hospital ID
      const response = await axios.post(
        `${baseUrl}/api/${hospitalId}/tickets/`,
        {
          title: data.title,
          device_id: data.deviceId || null,
          nfc_uuid: data.nfcUuid || null, // Include NFC UUID
          category: data.category,
          priority: data.priority,
          description: data.description,
          location: data.location,
          created_by_id: employeeId,
          assigned_to_id: null,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast({
        title: "Ticket Submitted",
        description: `Ticket ${response.data.ticket_id} has been submitted successfully.`,
      });
      navigate("/ticket");
    } catch (error) {
      console.error("Error submitting ticket:", error);
      toast({
        title: "Submission Failed",
        description: error.response?.data?.detail || "Failed to submit ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <div className="container mx-auto py-6 max-w-3xl animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Raise a Support Ticket</h1>
          <p className="text-muted-foreground">
            Submit an issue to be addressed by the biomedical engineering team
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New Ticket</CardTitle>
            <CardDescription>
              Please provide details about the issue you're experiencing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ticket Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief summary of the issue" {...field} />
                      </FormControl>
                      <FormDescription>
                        Provide a concise title describing the issue
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="deviceId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Device ID (Optional)</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Enter device ID or scan NFC"
                              {...field}
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
                        </FormControl>
                        <FormDescription>
                          Scan an NFC tag or enter the device ID manually
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Where is the device/issue located?" {...field} />
                        </FormControl>
                        <FormDescription>
                          Department, room number, etc.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issue Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pick a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="hardware">Hardware Problem</SelectItem>
                            <SelectItem value="software">Software Issue</SelectItem>
                            <SelectItem value="calibration">Calibration Required</SelectItem>
                            <SelectItem value="maintenance">Maintenance Request</SelectItem>
                            <SelectItem value="training">Usage Training</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the category that best describes the issue
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">
                              <div className="flex items-center">
                                <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                                Low - When convenient
                              </div>
                            </SelectItem>
                            <SelectItem value="medium">
                              <div className="flex items-center">
                                <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                                Medium - Attention required
                              </div>
                            </SelectItem>
                            <SelectItem value="high">
                              <div className="flex items-center">
                                <div className="h-2 w-2 rounded-full bg-orange-500 mr-2"></div>
                                High - Urgent issue
                              </div>
                            </SelectItem>
                            <SelectItem value="critical">
                              <div className="flex items-center">
                                <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                                Critical - Immediate response needed
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Indicate the urgency of this issue
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please provide detailed information about the issue..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include any relevant details that might help resolve the issue faster
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => navigate("/ticket")}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="flex gap-2">
                    {isSubmitting ? (
                      <>Processing</>
                    ) : (
                      <>
                        <Send size={16} />
                        Submit Ticket
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Be Specific</h4>
                    <p className="text-muted-foreground text-sm">
                      Include exact error messages, steps to reproduce, and all relevant details.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Attach Documentation</h4>
                    <p className="text-muted-foreground text-sm">
                      For complex issues, consider including screenshots or device documentation in the description.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Follow Up</h4>
                    <p className="text-muted-foreground text-sm">
                      Check your ticket status regularly and respond promptly to any questions from the engineering team.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default TicketRaise;
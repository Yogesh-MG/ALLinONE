
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertTriangle, CheckCircle, FileText, Send } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer-demo";
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

const ticketFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  deviceId: z.string().optional(),
  category: z.string({
    required_error: "Please select an issue category.",
  }),
  priority: z.string({
    required_error: "Please select a priority level.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  location: z.string().min(2, {
    message: "Please specify the location.",
  }),
});

type TicketFormValues = z.infer<typeof ticketFormSchema>;

const TicketRaisedemo = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: Partial<TicketFormValues> = {
    title: "",
    deviceId: "",
    category: "",
    priority: "medium",
    description: "",
    location: "",
  };

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: TicketFormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      console.log("Submitting ticket:", data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Ticket Submitted",
        description: "Your ticket has been submitted successfully.",
        variant: "default",
      });
      
      navigate("/tickets");
    } catch (error) {
      console.error("Error submitting ticket:", error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit ticket. Please try again.",
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
                          <Input placeholder="Enter device ID if applicable" {...field} />
                        </FormControl>
                        <FormDescription>
                          If this is about a specific device
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
                              <SelectValue placeholder="Select category" />
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
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate("/tickets")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex gap-2"
                  >
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

export default TicketRaisedemo;

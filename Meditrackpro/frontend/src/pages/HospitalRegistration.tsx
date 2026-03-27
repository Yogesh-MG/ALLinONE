import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { Hospital, User, Building, MapPin, Phone, AtSign, KeyRound, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { baseUrl } from "@/utils/apiconfig";
import { motion } from 'framer-motion'

const HospitalRegistrationSchema = z.object({
  hospitalName: z.string().min(2, { message: "Hospital name must be at least 2 characters" }),
  hospitalType: z.string().min(1, { message: "Please select hospital type" }),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zipCode: z.string().min(5, { message: "Valid zip code is required" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  adminFirstName: z.string().min(2, { message: "First name is required" }),
  adminLastName: z.string().min(1, { message: "Last name is required" }),
  adminEmail: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
  gstin: z.string().optional().refine((val) => !val || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val),
  { message: "Invalid GSTIN format" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof HospitalRegistrationSchema>;

const HospitalRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(HospitalRegistrationSchema),
    defaultValues: {
      hospitalName: "",
      hospitalType: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      email: "",
      adminFirstName: "",
      adminLastName: "",
      adminEmail: "",
      password: "",
      confirmPassword: "",
      gstin: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const hospitalData = {
      name: data.hospitalName,
      hospital_type: data.hospitalType,
      address: data.address,
      city: data.city,
      state: data.state,
      zipcode: data.zipCode,
      phone_number: data.phone,
      email: data.email,
      gstin: data.gstin || "",
    };

    const adminData = {
      first_name: data.adminFirstName,
      last_name: data.adminLastName,
      email: data.adminEmail,
      password: data.password,
    };

    const payload = { hospital: hospitalData, admin: adminData };

    try {
      const response = await axios.post(`${baseUrl}/api/register/`, payload);
      console.log("background",response.data);
      toast({
        title: "Registration Successful",
        description: "Your hospital has been registered successfully",
      });
      // Redirect with hospital and admin details
      setTimeout(() => navigate(`/payment?hospital_id=${encodeURIComponent(response.data.hospital)}&hospital_name=${encodeURIComponent(response.data.hospital_name)}&admin_email=${encodeURIComponent(response.data.admin_email)}&gstin=${encodeURIComponent(response.data.gstin || '')}`
      ), 1500);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || "Something went wrong! May be the email is already registered. contact the support team",
        variant: "destructive",
      });
    } finally { 
      setLoading(false);
    }

  };

  return (
    <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-medical-500">
        <div className="max-w-md text-white p-8">
          <Hospital className="h-12 w-12 mb-4" />
          <h1 className="text-3xl font-bold mb-2">MediTrack Pro</h1>
          <h2 className="text-xl font-medium mb-4">Hospital Management System</h2>
          <p className="mb-6">Join thousands of hospitals worldwide that trust MediTrack Pro for inventory management, device recalibration tracking, and healthcare automation.</p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <Building className="h-5 w-5 mt-0.5" />
              <div>
                <h3 className="font-medium">Centralized Management</h3>
                <p className="text-sm opacity-80">Manage multiple departments with ease</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <User className="h-5 w-5 mt-0.5" />
              <div>
                <h3 className="font-medium">Employee Administration</h3>
                <p className="text-sm opacity-80">Add doctors, staff and admin users</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Shield className="h-5 w-5 mt-0.5" />
              <div>
                <h3 className="font-medium">Compliance & Security</h3>
                <p className="text-sm opacity-80">Meet healthcare regulations with built-in tools</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Hospital Registration</CardTitle>
            <CardDescription>
              Register your hospital to use MediTrack Pro's complete healthcare management system
            </CardDescription>
          </CardHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Hospital Information</h3>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="hospitalName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hospital Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter hospital name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="hospitalType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hospital Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="general">General Hospital</SelectItem>
                              <SelectItem value="specialty">Specialty Hospital</SelectItem>
                              <SelectItem value="teaching">Teaching Hospital</SelectItem>
                              <SelectItem value="clinic">Clinic</SelectItem>
                              <SelectItem value="community">Community Health Center</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter street address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem className="md:col-span-1 col-span-2">
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Zip code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Hospital phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hospital Email</FormLabel>
                          <FormControl>
                            <Input placeholder="contact@hospital.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="gstin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GSTIN (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="22AAAAA0000A1Z5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Administrator Account</h3>
                  <p className="text-sm text-muted-foreground">This account will have full access to manage your hospital in MediTrack Pro</p>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="adminFirstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="adminLastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="adminEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="admin@hospital.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field}
                            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,}$" 
                            title="Password must be at least 6 characters, including letters and numbers"
                            required/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field}
                            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,}$" 
                            title="Password must be at least 6 characters, including letters and numbers"
                            required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Registering...
                      </div>
                    ) : (
                      "Register Hospital"
                    )}</Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
    </motion.div>
  );
};

export default HospitalRegistration;
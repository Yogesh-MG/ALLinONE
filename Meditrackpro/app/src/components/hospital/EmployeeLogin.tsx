import React, { useState } from "react"; // Add useState import
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Hospital, Lock, Mail, Loader2 } from "lucide-react"; // Add Loader2 for spinning icon
import { baseUrl } from "@/utils/apiconfig";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  full_name: string;
  role: string | null;
  type: "admin" | "employee" | "user" | null;
  hospital_name?: string | null;
  hospital: number;
}

const EmployeeLogin: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false); // Add loading state

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true); // Start loading
    try {
      const instanceKey = "shared";
  
      const loginResponse = await axios.post<{ access: string; refresh: string }>(`${baseUrl}/api/token/`, {
        username: data.email,
        password: data.password,
      });
  
      const { access, refresh } = loginResponse.data;
      localStorage.setItem("token", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("instanceKey", instanceKey);
  
      const tokenPayload = JSON.parse(atob(access.split('.')[1]));
  
      const userResponse = await axios.get<UserData>(`${baseUrl}/api/me/`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      const user = userResponse.data;
  
      if (user.hospital) {
        localStorage.setItem("hospitalid", user.hospital.toString());
      } else {
        localStorage.removeItem("hospitalid");
      }

      // Simulate 2-second delay (remove this if you want it tied to real API time)
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({ title: "Login Successful", description: `Welcome back, ${user.full_name}!` });
  
      if (user.type === "admin") {
        navigate("/hospital-dashboard");
      } else if (user.type === "employee") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ detail?: string }>;
      toast({
        title: "Login Failed",
        description: axiosError.response?.data?.detail || `Invalid credentials ${baseUrl}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex justify-center w-full">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Hospital className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">MediTrack Pro</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="name@hospital.com" type="email" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                        placeholder="Enter your password" 
                        type="password" 
                        className="pl-10" {...field}
                        pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,}$"  
                        title="Password must be at least 6 characters, including letters and numbers"
                       />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Logging In...
                  </div>
                ) : (
                  "Log In"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm text-muted-foreground mt-2">
            Not registered? <a href="/hospital-registration" className="underline text-primary">Register your hospital</a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmployeeLogin;
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Building, Users, Bell, CreditCard, Shield, Globe, Palette, Database, Save, Upload } from "lucide-react";
import api from "@/utils/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MembershipPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string[];
  is_active: boolean;
}

interface SettingsData {
  gym_name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  timezone: string;
  currency: string;
  date_format: string;
  language: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  two_factor: boolean;
  auto_backup: boolean;
  primary_color: string;
  secondary_color: string;
}

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SettingsData>({
    gym_name: "FitLife Wellness Center",
    email: "info@fitlifegym.com",
    phone: "(555) 123-4567",
    address: "",
    website: "",
    timezone: "est",
    currency: "usd",
    date_format: "mdy",
    language: "en",
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    two_factor: false,
    auto_backup: true,
    primary_color: "#6366f1",
    secondary_color: "#f1f5f9",
  });
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]); // Ensure initial state is an array
  const [newPlan, setNewPlan] = useState({ name: "", description: "", price: 0, features: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch settings and membership plans on mount
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/api/settings/");
        setSettings(response.data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to fetch settings.",
          variant: "destructive",
        });
      }
    };

    const fetchMembershipPlans = async () => {
      try {
        const response = await api.get("/api/membership-plans/");
        // Ensure response.data is an array
        setMembershipPlans(Array.isArray(response.data) ? response.data : []);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to fetch membership plans.",
          variant: "destructive",
        });
        setMembershipPlans([]); // Fallback to empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
    fetchMembershipPlans();
  }, [toast]);

  const handleSaveChanges = async () => {
    try {
      await api.put("/api/settings/", settings);
      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    toast({
      title: "Setting Updated",
      description: `${key.replace('_', ' ')} has been updated`,
    });
  };

  const handleAddPlan = async () => {
    try {
      const features = newPlan.features.split(',').map((f) => f.trim()).filter((f) => f);
      const response = await api.post("/api/membership-plans/", {
        ...newPlan,
        features,
      });
      setMembershipPlans([...membershipPlans, response.data]);
      setNewPlan({ name: "", description: "", price: 0, features: "" });
      toast({
        title: "Plan Created",
        description: `${newPlan.name} has been added.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create membership plan.",
        variant: "destructive",
      });
    }
  };

  const handleEditPlan = async (plan: MembershipPlan) => {
    try {
      const response = await api.put(`/api/membership-plans/${plan.id}/`, plan);
      setMembershipPlans(membershipPlans.map((p) => (p.id === plan.id ? response.data : p)));
      toast({
        title: "Plan Updated",
        description: `${plan.name} has been updated.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update membership plan.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePlan = async (planId: number) => {
    try {
      await api.delete(`/api/membership-plans/${planId}/`);
      setMembershipPlans(membershipPlans.filter((p) => p.id !== planId));
      toast({
        title: "Plan Deleted",
        description: "Membership plan has been deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete membership plan.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-background to-secondary/10 rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your gym's configuration and preferences</p>
        </div>
        <Button onClick={handleSaveChanges} className="bg-primary hover:bg-primary/90" disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-muted/50 rounded-lg">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="membership">Membership</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0 bg-card/95">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  Business Information
                </CardTitle>
                <CardDescription>Update your gym's basic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gym-name">Gym Name</Label>
                  <Input
                    id="gym-name"
                    value={settings.gym_name}
                    onChange={(e) => handleSettingChange("gym_name", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={settings.address}
                    onChange={(e) => handleSettingChange("address", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={settings.phone}
                      onChange={(e) => handleSettingChange("phone", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={settings.email}
                      onChange={(e) => handleSettingChange("email", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={settings.website}
                    onChange={(e) => handleSettingChange("website", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-card/95">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Regional Settings
                </CardTitle>
                <CardDescription>Configure timezone and regional preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => handleSettingChange("timezone", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                      <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                      <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                      <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(value) => handleSettingChange("currency", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD - US Dollar ($)</SelectItem>
                      <SelectItem value="eur">EUR - Euro (€)</SelectItem>
                      <SelectItem value="gbp">GBP - British Pound (£)</SelectItem>
                      <SelectItem value="cad">CAD - Canadian Dollar (C$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select
                    value={settings.date_format}
                    onValueChange={(value) => handleSettingChange("date_format", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => handleSettingChange("language", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg border-0 bg-card/95">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Appearance & Branding
              </CardTitle>
              <CardDescription>Customize the look and feel of your dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Logo Upload</Label>
                  <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload logo</p>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        // Handle file upload (requires backend endpoint)
                        toast({
                          title: "Logo Upload",
                          description: "Logo upload not implemented yet.",
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: settings.primary_color }}
                    ></div>
                    <Input
                      id="primary-color"
                      value={settings.primary_color}
                      onChange={(e) => handleSettingChange("primary_color", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: settings.secondary_color }}
                    ></div>
                    <Input
                      id="secondary-color"
                      value={settings.secondary_color}
                      onChange={(e) => handleSettingChange("secondary_color", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="membership" className="space-y-6">
          <Card className="shadow-lg border-0 bg-card/95">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Membership Plans
              </CardTitle>
              <CardDescription>Configure membership tiers and pricing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mb-4 bg-primary hover:bg-primary/90" disabled={isLoading}>
                    <Users className="h-4 w-4 mr-2" />
                    Add New Plan
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Membership Plan</DialogTitle>
                    <DialogDescription>Create a new membership plan for your gym.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="plan-name">Plan Name</Label>
                      <Input
                        id="plan-name"
                        value={newPlan.name}
                        onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="plan-description">Description</Label>
                      <Input
                        id="plan-description"
                        value={newPlan.description}
                        onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="plan-price">Price ($/month)</Label>
                      <Input
                        id="plan-price"
                        type="number"
                        value={newPlan.price}
                        onChange={(e) => setNewPlan({ ...newPlan, price: parseFloat(e.target.value) })}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="plan-features">Features (comma-separated)</Label>
                      <Input
                        id="plan-features"
                        value={newPlan.features}
                        onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value })}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddPlan} disabled={isLoading}>Create Plan</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {isLoading ? (
                <div className="text-center text-muted-foreground">Loading membership plans...</div>
              ) : membershipPlans.length === 0 ? (
                <div className="text-center text-muted-foreground">No membership plans available.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {membershipPlans.map((plan) => (
                    <Card key={plan.id} className="shadow-md hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <Badge variant="outline">{plan.is_active ? "Active" : "Inactive"}</Badge>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-2xl font-bold">${plan.price}/month</div>
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                        <ul className="text-sm space-y-1">
                          {plan.features.map((feature, index) => (
                            <li key={index}>• {feature}</li>
                          ))}
                        </ul>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => handleEditPlan({ ...plan, is_active: !plan.is_active })}
                            disabled={isLoading}
                          >
                            {plan.is_active ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            variant="destructive"
                            className="w-full"
                            onClick={() => handleDeletePlan(plan.id)}
                            disabled={isLoading}
                          >
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-lg border-0 bg-card/95">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.email_notifications}
                    onCheckedChange={(checked) => handleSettingChange("email_notifications", checked)}
                    disabled={isLoading}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={settings.sms_notifications}
                    onCheckedChange={(checked) => handleSettingChange("sms_notifications", checked)}
                    disabled={isLoading}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={settings.push_notifications}
                    onCheckedChange={(checked) => handleSettingChange("push_notifications", checked)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other Tabs (Payments, Security, Integrations) remain unchanged for brevity */}
      </Tabs>
    </div>
  );
};

export default Settings;
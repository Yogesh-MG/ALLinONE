
import React, { useState} from "react";
import { Building2, ChevronsUpDown, Globe, LockKeyhole, MailOpen, Shield, UserCog, Wallet } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import OrganizationSettings from "./OrganizationSettings";
import SecuritySettings from "./SecuritySettings";
import NotificationSettings from "./NotificationSettings";
import BillingSettings from "./BillingSettings";
import InternationalSettings from "./InternationalSettings";

const Settings = () => {

  const [activeTab, setActiveTab] = useState("organization");

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account and application preferences
            </p>
          </div>
          <Button className="hidden md:flex">Save Changes</Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <Card className="md:max-w-[240px] flex-shrink-0">
            <CardHeader className="p-4">
              <CardTitle className="text-lg">Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="profile"  className="w-full" orientation="vertical">
                <TabsList className="flex flex-col h-full bg-transparent border-r rounded-none space-y-1 items-start p-0">
                  <TabsTrigger value="profile" onClick={ () => setActiveTab('profile')} className="w-full justify-start px-4 py-2">
                    <UserCog className="mr-2 h-4 w-4" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="organization" onClick={ () => setActiveTab('organization')} className="w-full justify-start px-4 py-2">
                    <Building2 className="mr-2 h-4 w-4" />
                    Organization
                  </TabsTrigger>
                  <TabsTrigger value="security" onClick={ () => setActiveTab('security')}className="w-full justify-start px-4 py-2">
                    <Shield className="mr-2 h-4 w-4" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="notifications" onClick={ () => setActiveTab('notifications')} className="w-full justify-start px-4 py-2">
                    <MailOpen className="mr-2 h-4 w-4" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="billing" onClick={ () => setActiveTab('billing')} className="w-full justify-start px-4 py-2">
                    <Wallet className="mr-2 h-4 w-4" />
                    Billing
                  </TabsTrigger>
                  <TabsTrigger value="international" onClick={ () => setActiveTab('international')} className="w-full justify-start px-4 py-2">
                    <Globe className="mr-2 h-4 w-4" />
                    International
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="profile" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>
                      Manage your account information and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First Name</Label>
                          <Input id="first-name" placeholder="John" defaultValue="John" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last Name</Label>
                          <Input id="last-name" placeholder="Doe" defaultValue="Doe" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="john.doe@example.com" defaultValue="john.doe@example.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" type="tel" placeholder="(555) 123-4567" defaultValue="(555) 123-4567" />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Job Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="job-title">Job Title</Label>
                          <Input id="job-title" placeholder="Medical Director" defaultValue="Medical Director" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Select defaultValue="cardiology">
                            <SelectTrigger id="department">
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="administration">Administration</SelectItem>
                              <SelectItem value="cardiology">Cardiology</SelectItem>
                              <SelectItem value="neurology">Neurology</SelectItem>
                              <SelectItem value="orthopedics">Orthopedics</SelectItem>
                              <SelectItem value="radiology">Radiology</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Account Preferences</h3>
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="language">Language</Label>
                            <p className="text-sm text-muted-foreground">
                              Select your preferred language for the interface
                            </p>
                          </div>
                          <Select defaultValue="en">
                            <SelectTrigger id="language" className="w-[180px]">
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Spanish</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                              <SelectItem value="de">German</SelectItem>
                              <SelectItem value="zh">Chinese</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Time Zone</Label>
                            <p className="text-sm text-muted-foreground">
                              Set your local time zone for accurate scheduling
                            </p>
                          </div>
                          <Select defaultValue="est">
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select time zone" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="est">Eastern (EST)</SelectItem>
                              <SelectItem value="cst">Central (CST)</SelectItem>
                              <SelectItem value="mst">Mountain (MST)</SelectItem>
                              <SelectItem value="pst">Pacific (PST)</SelectItem>
                              <SelectItem value="utc">UTC</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-between flex-wrap gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="organization" className="m-0">
                <OrganizationSettings />
              </TabsContent>

              <TabsContent value="security" className="m-0">
                <SecuritySettings />
              </TabsContent>

              <TabsContent value="notifications" className="m-0">
                <NotificationSettings />
              </TabsContent>
              
              <TabsContent value="billing" className="m-0">
                <BillingSettings />
              </TabsContent>
              
              <TabsContent value="international" className="m-0">
                <InternationalSettings />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Settings;

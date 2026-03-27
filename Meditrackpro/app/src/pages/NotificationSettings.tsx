
import React from "react";
import { Bell, Mail, Phone, MessageSquare, Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const NotificationSettings = () => {
  return (
    <Card>
      <div className="p-6">
        <Tabs defaultValue="preferences" className="w-full">
          <TabsList className="mb-6 w-full justify-start">
            <TabsTrigger value="preferences">
              <Bell className="mr-2 h-4 w-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="channels">
              <Phone className="mr-2 h-4 w-4" />
              Channels
            </TabsTrigger>
            <TabsTrigger value="schedule">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="preferences" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">System Alerts</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-base font-medium">Low Inventory Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when inventory items are running low</p>
                  </div>
                  <Switch id="inventory-alerts" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-base font-medium">Device Maintenance Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified about upcoming device maintenance</p>
                  </div>
                  <Switch id="maintenance-alerts" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-base font-medium">Compliance Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get notified about compliance deadlines</p>
                  </div>
                  <Switch id="compliance-alerts" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-base font-medium">Order Status Updates</Label>
                    <p className="text-sm text-muted-foreground">Get notified when order statuses change</p>
                  </div>
                  <Switch id="order-alerts" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-base font-medium">System Updates</Label>
                    <p className="text-sm text-muted-foreground">Get notified about system updates and maintenance</p>
                  </div>
                  <Switch id="system-alerts" defaultChecked />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Messages & Comments</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-base font-medium">Direct Messages</Label>
                    <p className="text-sm text-muted-foreground">Get notified when you receive direct messages</p>
                  </div>
                  <Switch id="direct-messages" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-base font-medium">Comment Mentions</Label>
                    <p className="text-sm text-muted-foreground">Get notified when you're mentioned in comments</p>
                  </div>
                  <Switch id="comment-mentions" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-base font-medium">Team Announcements</Label>
                    <p className="text-sm text-muted-foreground">Get notified about team announcements</p>
                  </div>
                  <Switch id="team-announcements" defaultChecked />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="channels" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Email Notifications</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email-frequency">Email Frequency</Label>
                  <Select defaultValue="immediate">
                    <SelectTrigger id="email-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="hourly">Hourly Digest</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Digest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">SMS Notifications</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                  </div>
                  <Switch id="sms-notifications" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sms-types">SMS Notification Types</Label>
                  <Select defaultValue="critical">
                    <SelectTrigger id="sms-types">
                      <SelectValue placeholder="Select types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Notifications</SelectItem>
                      <SelectItem value="critical">Critical Alerts Only</SelectItem>
                      <SelectItem value="security">Security Alerts Only</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center">
                <Bell className="mr-2 h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Push Notifications</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications in your browser or mobile app</p>
                  </div>
                  <Switch id="push-notifications" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="push-types">Push Notification Types</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="push-types">
                      <SelectValue placeholder="Select types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Notifications</SelectItem>
                      <SelectItem value="critical">Critical Alerts Only</SelectItem>
                      <SelectItem value="important">Important & Critical</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Notification Schedule</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Do Not Disturb</Label>
                    <p className="text-sm text-muted-foreground">Pause all notifications during specified hours</p>
                  </div>
                  <Switch id="do-not-disturb" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dnd-start">Start Time</Label>
                    <Select defaultValue="22:00">
                      <SelectTrigger id="dnd-start">
                        <SelectValue placeholder="Select start time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20:00">8:00 PM</SelectItem>
                        <SelectItem value="21:00">9:00 PM</SelectItem>
                        <SelectItem value="22:00">10:00 PM</SelectItem>
                        <SelectItem value="23:00">11:00 PM</SelectItem>
                        <SelectItem value="00:00">12:00 AM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dnd-end">End Time</Label>
                    <Select defaultValue="07:00">
                      <SelectTrigger id="dnd-end">
                        <SelectValue placeholder="Select end time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="05:00">5:00 AM</SelectItem>
                        <SelectItem value="06:00">6:00 AM</SelectItem>
                        <SelectItem value="07:00">7:00 AM</SelectItem>
                        <SelectItem value="08:00">8:00 AM</SelectItem>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label className="text-base font-medium">Active Days</Label>
                  <p className="text-sm text-muted-foreground">Select days when you want to receive notifications</p>
                  
                  <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Switch id={`day-${day.toLowerCase()}`} defaultChecked={!["Saturday", "Sunday"].includes(day)} />
                        <Label htmlFor={`day-${day.toLowerCase()}`}>{day}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Allow Critical Alerts During DND</Label>
                    <p className="text-sm text-muted-foreground">Critical notifications will still be delivered during Do Not Disturb hours</p>
                  </div>
                  <Switch id="critical-during-dnd" defaultChecked />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </Card>
  );
};

export default NotificationSettings;

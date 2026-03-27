
import React from "react";
import { LockKeyhole, KeyRound, UserCheck, Shield, FileKey } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const SecuritySettings = () => {
  return (
    <Card>
      <div className="space-y-6 p-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <LockKeyhole className="mr-2 h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-medium">Password Settings</h3>
          </div>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
          </div>
          <Button size="sm" className="mt-2">Change Password</Button>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Enable Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <Switch id="2fa" defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="2fa-method">Preferred 2FA Method</Label>
              <Select defaultValue="app">
                <SelectTrigger id="2fa-method">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="app">Authenticator App</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" className="mt-2">Configure 2FA</Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center">
            <UserCheck className="mr-2 h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-medium">Login Sessions</h3>
          </div>
          <div>
            <p className="mb-4 text-sm text-muted-foreground">You're currently logged in on these devices:</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>Windows PC</span>
                      <span className="text-xs text-muted-foreground">Chrome 115</span>
                    </div>
                  </TableCell>
                  <TableCell>New York, US</TableCell>
                  <TableCell>192.168.1.1</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>Now</span>
                      <Badge className="mt-1 w-fit" variant="outline">Current</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">Logout</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>iPhone 14</span>
                      <span className="text-xs text-muted-foreground">Safari 16</span>
                    </div>
                  </TableCell>
                  <TableCell>Boston, US</TableCell>
                  <TableCell>192.168.2.2</TableCell>
                  <TableCell>4 hours ago</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">Logout</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Button variant="outline" size="sm" className="mt-4">Logout from All Devices</Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center">
            <KeyRound className="mr-2 h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-medium">API Access</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">API Access</Label>
                <p className="text-sm text-muted-foreground">Enable API access for third-party integrations</p>
              </div>
              <Switch id="api-access" defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <div className="flex">
                <Input 
                  id="api-key" 
                  type="password" 
                  value="••••••••••••••••••••••••••••••"
                  className="rounded-r-none"
                  readOnly
                />
                <Button variant="secondary" className="rounded-l-none">
                  Show
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Last regenerated on May 12, 2023</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Regenerate API Key</Button>
              <Button variant="outline" size="sm">Manage API Permissions</Button>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center">
            <FileKey className="mr-2 h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-medium">Security Log</h3>
          </div>
          <div>
            <p className="mb-4 text-sm text-muted-foreground">Recent security events for your account:</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Password Changed</TableCell>
                  <TableCell>May 15, 2023</TableCell>
                  <TableCell>192.168.1.1</TableCell>
                  <TableCell>New York, US</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Login Successful</TableCell>
                  <TableCell>May 14, 2023</TableCell>
                  <TableCell>192.168.2.2</TableCell>
                  <TableCell>Boston, US</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Failed Login Attempt</TableCell>
                  <TableCell>May 13, 2023</TableCell>
                  <TableCell>192.168.3.3</TableCell>
                  <TableCell>Chicago, US</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Button variant="outline" size="sm" className="mt-4">View Full Security Log</Button>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </Card>
  );
};

export default SecuritySettings;

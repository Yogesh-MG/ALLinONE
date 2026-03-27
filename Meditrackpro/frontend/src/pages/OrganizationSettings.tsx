
import React from "react";
import { Building2, MapPin, Globe, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const OrganizationSettings = () => {
  return (
    <Card>
      <div className="space-y-6 p-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <Building2 className="mr-2 h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-medium">Organization Details</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input id="org-name" placeholder="Enter organization name" defaultValue="MediTrack Health Systems" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-type">Organization Type</Label>
              <Select defaultValue="hospital">
                <SelectTrigger id="org-type">
                  <SelectValue placeholder="Select organization type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hospital">Hospital</SelectItem>
                  <SelectItem value="clinic">Clinic</SelectItem>
                  <SelectItem value="pharmacy">Pharmacy</SelectItem>
                  <SelectItem value="laboratory">Laboratory</SelectItem>
                  <SelectItem value="supplier">Medical Supplier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax-id">Tax ID / Business Registration</Label>
              <Input id="tax-id" placeholder="Enter Tax ID" defaultValue="98-7654321" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license">Medical License Number</Label>
              <Input id="license" placeholder="Enter License Number" defaultValue="MED-12345-HC" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="established">Established Date</Label>
              <Input id="established" type="date" defaultValue="2010-05-15" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" placeholder="https://..." defaultValue="https://meditrack-health.com" />
            </div>
            <div className="col-span-1 space-y-2 md:col-span-2">
              <Label htmlFor="description">Organization Description</Label>
              <Textarea
                id="description"
                placeholder="Enter a description of your organization"
                className="min-h-[100px]"
                defaultValue="MediTrack Health Systems is a leading healthcare provider specializing in comprehensive medical services and innovative healthcare solutions."
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-medium">Primary Location</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="col-span-1 space-y-2 md:col-span-2">
              <Label htmlFor="address">Street Address</Label>
              <Textarea 
                id="address" 
                placeholder="Enter address" 
                defaultValue="123 Healthcare Avenue, Suite 500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="Enter city" defaultValue="Medical City" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input id="state" placeholder="Enter state/province" defaultValue="Healthstate" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postal-code">Postal Code</Label>
              <Input id="postal-code" placeholder="Enter postal code" defaultValue="54321" />
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
                  <SelectItem value="in">India</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="est">
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="est">Eastern Time (ET)</SelectItem>
                  <SelectItem value="cst">Central Time (CT)</SelectItem>
                  <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                  <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                  <SelectItem value="utc">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center">
            <Phone className="mr-2 h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-medium">Contact Information</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="main-phone">Main Phone</Label>
              <Input id="main-phone" placeholder="(555) 123-4567" defaultValue="(555) 987-6543" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alt-phone">Alternative Phone</Label>
              <Input id="alt-phone" placeholder="(555) 987-6543" defaultValue="(555) 456-7890" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fax">Fax</Label>
              <Input id="fax" placeholder="(555) 555-5555" defaultValue="(555) 123-7890" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">General Email</Label>
              <Input id="email" type="email" placeholder="info@example.com" defaultValue="info@meditrack-health.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-email">Support Email</Label>
              <Input id="support-email" type="email" placeholder="support@example.com" defaultValue="support@meditrack-health.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency">Emergency Contact Number</Label>
              <Input id="emergency" placeholder="(555) 911-0000" defaultValue="(555) 911-1234" />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center">
            <Globe className="mr-2 h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-medium">Branch Information</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Multi-Location Support</Label>
                <p className="text-sm text-muted-foreground">Enable this if your organization has multiple locations</p>
              </div>
              <Switch id="multi-location" defaultChecked />
            </div>
            <Button variant="outline" className="mt-2">
              Manage Locations
            </Button>
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

export default OrganizationSettings;


import React from "react";
import { CreditCard, Receipt, Wallet, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const BillingSettingsdemo = () => {
  return (
    <Card>
      <div className="space-y-6 p-6">
        <div className="flex gap-2">
          <div className="rounded-md bg-primary/10 p-3">
            <CheckCircle2 className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium">Current Plan: Professional</h3>
            <p className="text-sm text-muted-foreground">Your plan renews on June 15, 2023</p>
            <div className="mt-2 flex gap-2">
              <Button variant="outline" size="sm">Change Plan</Button>
              <Button variant="outline" size="sm">Cancel Subscription</Button>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-medium">Payment Methods</h3>
          </div>
          
          <div className="rounded-md border shadow-sm">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="flex h-10 w-16 items-center justify-center rounded-md bg-slate-50">
                    <svg width="28" height="28" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                      <rect fill="#0A2540" width="32" height="32" rx="3"/>
                      <path d="M21.3 11.7c0-1.3-1-2.3-2.3-2.3s-2.3 1-2.3 2.3c0 1.3 1 2.3 2.3 2.3s2.3-1 2.3-2.3z" fill="#87BBFD"/>
                      <path d="M13 17.8v-1.5c0-.5.4-.9.9-.9h9.4c.5 0 .9.4.9.9v1.5c0 .5-.4.9-.9.9h-9.4c-.5 0-.9-.4-.9-.9zm0 5.1v-1.5c0-.5.4-.9.9-.9h9.4c.5 0 .9.4.9.9v1.5c0 .5-.4.9-.9.9h-9.4c-.5 0-.9-.4-.9-.9zm-6-10.3v-1.5c0-.5.4-.9.9-.9h9.4c.5 0 .9.4.9.9v1.5c0 .5-.4.9-.9.9H7.9c-.5 0-.9-.4-.9-.9zm0 5.2v-1.5c0-.5.4-.9.9-.9h9.4c.5 0 .9.4.9.9v1.5c0 .5-.4.9-.9.9H7.9c-.5 0-.9-.4-.9-.9zm0 5.1v-1.5c0-.5.4-.9.9-.9h9.4c.5 0 .9.4.9.9v1.5c0 .5-.4.9-.9.9H7.9c-.5 0-.9-.4-.9-.9z" fill="#87BBFD"/>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                  </div>
                </div>
                <Badge variant="outline" className="rounded-full text-xs">Default</Badge>
              </div>
            </div>
          </div>
          
          <Button variant="outline" size="sm">
            <CreditCard className="mr-2 h-4 w-4" />
            Add Payment Method
          </Button>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="flex items-center">
            <Receipt className="mr-2 h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-medium">Billing Information</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input id="company-name" defaultValue="MediTrack Health Systems" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-name">Contact Name</Label>
              <Input id="contact-name" defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billing-email">Billing Email</Label>
              <Input id="billing-email" type="email" defaultValue="billing@meditrack-health.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax-id">Tax ID / VAT Number</Label>
              <Input id="tax-id" defaultValue="98-7654321" />
            </div>
            <div className="col-span-1 space-y-2 md:col-span-2">
              <Label htmlFor="billing-address">Billing Address</Label>
              <Input id="billing-address" defaultValue="123 Healthcare Avenue, Suite 500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" defaultValue="Medical City" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input id="state" defaultValue="Healthstate" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postal-code">Postal Code</Label>
              <Input id="postal-code" defaultValue="54321" />
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
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-medium">Billing History</h3>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">INV-00123</TableCell>
                <TableCell>$199.00</TableCell>
                <TableCell>May 15, 2023</TableCell>
                <TableCell>
                  <Badge variant="default" className="bg-green-500 text-white">Paid</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Download</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">INV-00122</TableCell>
                <TableCell>$199.00</TableCell>
                <TableCell>Apr 15, 2023</TableCell>
                <TableCell>
                  <Badge variant="default" className="bg-green-500 text-white">Paid</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Download</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">INV-00121</TableCell>
                <TableCell>$199.00</TableCell>
                <TableCell>Mar 15, 2023</TableCell>
                <TableCell>
                  <Badge variant="default" className="bg-green-500 text-white">Paid</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Download</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          
          <Button variant="outline" size="sm">View All Invoices</Button>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="flex items-center">
            <Wallet className="mr-2 h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-medium">Payment Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Auto-renew Subscription</Label>
                <p className="text-sm text-muted-foreground">Automatically renew your subscription when it expires</p>
              </div>
              <Switch id="auto-renew" defaultChecked />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="billing-cycle">Billing Cycle</Label>
              <Select defaultValue="monthly">
                <SelectTrigger id="billing-cycle">
                  <SelectValue placeholder="Select billing cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually (Save 15%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Send Receipt Emails</Label>
                <p className="text-sm text-muted-foreground">Receive emails when payments are processed</p>
              </div>
              <Switch id="receipt-emails" defaultChecked />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-900/20">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-400">Important Information</h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>
                  Changing your billing cycle will take effect on your next billing date. Any changes to your subscription will be prorated.
                </p>
              </div>
            </div>
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

export default BillingSettingsdemo;

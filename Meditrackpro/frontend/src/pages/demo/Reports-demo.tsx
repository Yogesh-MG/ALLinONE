import React, { useState } from "react";
import { Download, Filter, Printer, RefreshCcw } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer-demo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const Reportsdemo = () => {
  const [activeTab, setActiveTab] = useState("inventory");

  // Placeholder data for reports (replace with actual data source)
  const reportData = {
    inventory: [
      { name: "Current Inventory Status", lastGenerated: "Today, 09:45 AM", type: "Inventory", status: "Ready" },
    ],
    devices: [
      { name: "Device Maintenance Schedule", lastGenerated: "Today, 11:30 AM", type: "Maintenance", status: "Ready" },
    ],
    orders: [
      { name: "Purchase Order Summary", lastGenerated: "Today, 10:15 AM", type: "Procurement", status: "Ready" },
    ],
    financial: [
      { name: "Monthly Procurement Expenses", lastGenerated: "May 1, 2023", type: "Financial", status: "Ready" },
    ],
  };

  // Action handlers
  const handleView = (reportName) => {
    // Replace with logic to view the report (e.g., open modal, redirect, fetch data)
    console.log(`Viewing report: ${reportName}`);
    alert(`Viewing report: ${reportName}`);
  };

  const handleDownload = (reportName) => {
    // Replace with logic to download the report (e.g., generate PDF/CSV)
    console.log(`Downloading report: ${reportName}`);
    const dummyContent = `Report: ${reportName}\nGenerated on: ${new Date().toLocaleString()}`;
    const blob = new Blob([dummyContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${reportName}.txt`; // Customize file name and extension
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = (reportName) => {
    // Replace with logic to print the report
    console.log(`Printing report: ${reportName}`);
    const printContent = `
      <h1>${reportName}</h1>
      <p>Generated on: ${new Date().toLocaleString()}</p>
      <p>This is a sample report content for ${reportName}.</p>
    `;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const renderTableRows = (tab) => {
    return reportData[tab].map((report, index) => (
      <TableRow key={index}>
        <TableCell className="font-medium">{report.name}</TableCell>
        <TableCell>{report.lastGenerated}</TableCell>
        <TableCell>{report.type}</TableCell>
        <TableCell>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {report.status}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => handleView(report.name)}>
              View
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleDownload(report.name)}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePrint(report.name)}
            >
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              Generate and view reports for inventory, devices, and more
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <RefreshCcw className="h-4 w-4" />
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Reports</CardTitle>
                <TabsList>
                  <TabsTrigger value="inventory">Inventory</TabsTrigger>
                  <TabsTrigger value="devices">Devices</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="financial">Financial</TabsTrigger>
                </TabsList>
              </div>
              <CardDescription className="pt-2">
                {activeTab === "inventory" && "View inventory reports and analytics"}
                {activeTab === "devices" && "View device maintenance and calibration reports"}
                {activeTab === "orders" && "View order and procurement reports"}
                {activeTab === "financial" && "View financial reports and analytics"}
              </CardDescription>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Filter className="h-3.5 w-3.5" />
                      <span>Filter</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="start">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Filter by</h4>
                        <Separator />
                      </div>
                      <div className="grid gap-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <Label htmlFor="from">From</Label>
                            <Input id="from" type="date" className="h-8" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="to">To</Label>
                            <Input id="to" type="date" className="h-8" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select>
                            <SelectTrigger id="category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Categories</SelectItem>
                              <SelectItem value="medicine">Medicine</SelectItem>
                              <SelectItem value="equipment">Equipment</SelectItem>
                              <SelectItem value="consumable">Consumable</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select>
                            <SelectTrigger id="status">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Statuses</SelectItem>
                              <SelectItem value="in-stock">In Stock</SelectItem>
                              <SelectItem value="low-stock">Low Stock</SelectItem>
                              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button className="w-full">Apply Filters</Button>
                    </div>
                  </PopoverContent>
                </Popover>
                <div className="relative flex-1">
                  <Input placeholder="Search reports..." className="w-full" />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <TabsContent value="inventory" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Last Generated</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>{renderTableRows("inventory")}</TableBody>
                </Table>
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </TabsContent>

              <TabsContent value="devices" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Last Generated</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>{renderTableRows("devices")}</TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="orders" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Last Generated</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>{renderTableRows("orders")}</TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="financial" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Last Generated</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>{renderTableRows("financial")}</TableBody>
                </Table>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Reportsdemo;

import React from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer-demo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

const InventoryAdddemo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success",
      description: "Item added to inventory successfully.",
    });
    // In a real app, we would send data to the backend here
    // Then navigate back to inventory list
    setTimeout(() => navigate("/inventory"), 1000);
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Add Inventory Item</h1>
            <p className="text-muted-foreground">
              Add a new item to your medical inventory
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/inventory")}>
            Back to Inventory
          </Button>
        </div>

        <Card>
          <Tabs defaultValue="general" className="w-full">
            <CardHeader>
              <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
                <CardTitle>Item Information</CardTitle>
                <TabsList>
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="inventory">Inventory</TabsTrigger>
                </TabsList>
              </div>
              <CardDescription>
                Enter the details of the item you want to add to your inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <TabsContent value="general" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Item Name</Label>
                      <Input id="name" placeholder="Enter item name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="medicine">Medicine</SelectItem>
                          <SelectItem value="equipment">Equipment</SelectItem>
                          <SelectItem value="consumable">Consumable</SelectItem>
                          <SelectItem value="surgical">Surgical Supply</SelectItem>
                          <SelectItem value="diagnostic">Diagnostic Supply</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU/Item Code</Label>
                      <Input id="sku" placeholder="Enter SKU" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="barcode">Barcode</Label>
                      <Input id="barcode" placeholder="Enter barcode" />
                    </div>
                    <div className="col-span-1 space-y-2 md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Enter item description"
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="pricing" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="cost">Cost Price</Label>
                      <Input id="cost" type="number" step="0.01" placeholder="0.00" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="selling">Selling Price</Label>
                      <Input id="selling" type="number" step="0.01" placeholder="0.00" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tax">Tax Rate (%)</Label>
                      <Input id="tax" type="number" step="0.01" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplier">Preferred Supplier</Label>
                      <Select>
                        <SelectTrigger id="supplier">
                          <SelectValue placeholder="Select supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="medico">Medico Supplies</SelectItem>
                          <SelectItem value="healthcare">Healthcare Solutions</SelectItem>
                          <SelectItem value="pharmex">Pharmex Inc.</SelectItem>
                          <SelectItem value="medequip">MedEquip Global</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="inventory" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Initial Quantity</Label>
                      <Input id="quantity" type="number" placeholder="0" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reorder">Reorder Level</Label>
                      <Input id="reorder" type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Storage Location</Label>
                      <Input id="location" placeholder="e.g., Shelf A3, Room 102" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="batch">Batch Number</Label>
                      <Input id="batch" placeholder="Enter batch number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit of Measure</Label>
                      <Select>
                        <SelectTrigger id="unit">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="each">Each</SelectItem>
                          <SelectItem value="box">Box</SelectItem>
                          <SelectItem value="pack">Pack</SelectItem>
                          <SelectItem value="vial">Vial</SelectItem>
                          <SelectItem value="bottle">Bottle</SelectItem>
                          <SelectItem value="ampule">Ampule</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <div className="mt-6 flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => navigate("/inventory")}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Item</Button>
                </div>
              </form>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </PageContainer>
  );
};

export default InventoryAdddemo;

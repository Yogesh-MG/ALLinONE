

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";
import PageContainer from "@/components/layout/PageContainer-demo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Invoicedemo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = React.useState<Date>();
  const [dueDate, setDueDate] = React.useState<Date>();
  const [items, setItems] = useState([{ description: "", quantity: 1, rate: 0, amount: 0 }]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [claimStatus, setClaimStatus] = useState("pending");
  const [claimAmount, setClaimAmount] = useState(0);
  const [coverage, setCoverage] = useState(0);
  const coveredAmount = total * (coverage / 100);
  const outOfPocket = total - coveredAmount;


  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Calculate amount if quantity or rate changed
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = (newItems[index].quantity || 0) * (newItems[index].rate || 0);
    }
    
    setItems(newItems);
    
    // Recalculate subtotal
    const newSubtotal = newItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    setSubtotal(newSubtotal);
    
    // Recalculate tax and total
    const newTax = newSubtotal * 0.1; // Assuming 10% tax
    setTax(newTax);
    setTotal(newSubtotal + newTax);
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      
      // Recalculate subtotal
      const newSubtotal = newItems.reduce((sum, item) => sum + (item.amount || 0), 0);
      setSubtotal(newSubtotal);
      
      // Recalculate tax and total
      const newTax = newSubtotal * 0.1; // Assuming 10% tax
      setTax(newTax);
      setTotal(newSubtotal + newTax);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success",
      description: "Invoice created successfully.",
    });
    // In a real app, we would send data to the backend here
    setTimeout(() => navigate("/billing"), 1000);
  };
  

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create Invoice</h1>
            <p className="text-muted-foreground">
              Create a new invoice for a customer or patient
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/billing")}>
            Back to Billing
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Information</CardTitle>
            <CardDescription>
              Fill in the details for your new invoice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="invoice-number">Invoice Number</Label>
                    <Input id="invoice-number" placeholder="INV-00001" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Invoice Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dueDate ? format(dueDate, "PPP") : "Select due date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dueDate}
                          onSelect={setDueDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Invoice Status</Label>
                    <Select defaultValue="draft">
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Customer Information</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="customer-type">Customer Type</Label>
                    <Select defaultValue="patient">
                      <SelectTrigger id="customer-type">
                        <SelectValue placeholder="Select customer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="patient">Patient</SelectItem>
                        <SelectItem value="hospital">Hospital</SelectItem>
                        <SelectItem value="clinic">Clinic</SelectItem>
                        <SelectItem value="pharmacy">Pharmacy</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer">Customer Name</Label>
                    <Input id="customer" placeholder="Jhon" required />
                  </div>
                  <div className="col-span-1 space-y-2 md:col-span-2">
                    <Label htmlFor="billing-address">Billing Address</Label>
                    <Textarea
                      id="billing-address"
                      placeholder="Enter billing address"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Insurance Information</h3>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="insurance-provider">Insurance Provider</Label>
                    <Input 
                      id="insurance-provider" 
                      placeholder="Enter insurance provider name" 
                      value={insuranceProvider} 
                      onChange={(e) => setInsuranceProvider(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="policy-number">Policy Number</Label>
                    <Input 
                      id="policy-number" 
                      placeholder="Enter policy number" 
                      value={policyNumber} 
                      onChange={(e) => setPolicyNumber(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="claim-status">Claim Status</Label>
                    <Select 
                      value={claimStatus} 
                      onValueChange={setClaimStatus}
                    >
                      <SelectTrigger id="claim-status">
                        <SelectValue placeholder="Select claim status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="claim-amount">Claim Amount</Label>
                    <Input 
                      type="number" 
                      id="claim-amount" 
                      placeholder="Enter claim amount" 
                      value={claimAmount} 
                      onChange={(e) => setClaimAmount(parseFloat(e.target.value) || 0)} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coverage">Coverage Percentage</Label>
                    <Input 
                      type="number" 
                      id="coverage" 
                      placeholder="Enter coverage percentage" 
                      value={coverage} 
                      onChange={(e) => setCoverage(parseFloat(e.target.value) || 0)} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Insurance Covered Amount</Label>
                    <Input 
                      type="number" 
                      readOnly 
                      value={(total * (coverage / 100)).toFixed(2)} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Out-of-Pocket Amount</Label>
                    <Input 
                      type="number" 
                      readOnly 
                      value={(total - total * (coverage / 100)).toFixed(2)} 
                    />
                  </div>
                </div>
              </div>


              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Invoice Items</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Description</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input 
                            placeholder="Item description" 
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="number" 
                            min="1" 
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01" 
                            value={item.rate}
                            onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                          />
                        </TableCell>
                        <TableCell>${item.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeItem(index)}
                            disabled={items.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="ml-auto w-full space-y-2 md:w-1/3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Information</h3>
                <div className="col-span-1 space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter additional notes for this invoice"
                    className="min-h-[80px]"
                  />
                </div>
                <div className="col-span-1 space-y-2 md:col-span-2">
                  <Label htmlFor="payment-instructions">Payment Instructions</Label>
                  <Textarea
                    id="payment-instructions"
                    placeholder="Enter payment instructions"
                    className="min-h-[80px]"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => navigate("/billing")}>
                  Cancel
                </Button>
                <Button type="button" variant="outline">Save as Draft</Button>
                <Button type="submit">Create Invoice</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Invoicedemo;

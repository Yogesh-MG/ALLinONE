import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const IncomingGoods = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const goods = [
    { id: 1, date: "2024-01-15", supplier: "Motor Parts Co.", item: "Copper Wire 2.5mm", quantity: "50 kg", price: "₹15,000" },
    { id: 2, date: "2024-01-14", supplier: "Industrial Supplies", item: "Bearing Set", quantity: "20 pcs", price: "₹8,500" },
    { id: 3, date: "2024-01-13", supplier: "Electrical Wholesale", item: "Insulation Paper", quantity: "100 sheets", price: "₹3,200" },
    { id: 4, date: "2024-01-12", supplier: "Motor Parts Co.", item: "Rotor Assembly", quantity: "5 pcs", price: "₹25,000" },
  ];

  const handleAddGoods = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Incoming goods added successfully!");
    setIsDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Incoming Goods</h1>
            <p className="text-muted-foreground mt-1">Track inventory and material receipts</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Incoming Goods
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Incoming Goods</DialogTitle>
                <DialogDescription>Enter goods receipt details</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddGoods} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier *</Label>
                  <Input id="supplier" placeholder="Supplier name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item">Item *</Label>
                  <Input id="item" placeholder="Item description" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input id="quantity" placeholder="e.g., 50 kg, 20 pcs" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input id="price" type="number" placeholder="0.00" required />
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Goods</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {goods.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell className="font-medium">{item.supplier}</TableCell>
                  <TableCell>{item.item}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="font-semibold">{item.price}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IncomingGoods;

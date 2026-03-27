import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Quotations = () => {
  const navigate = useNavigate();
  const quotations = [
    { id: "QUO-001", customer: "ABC Motors", date: "2024-01-15", total: "₹15,000", status: "pending" },
    { id: "QUO-002", customer: "XYZ Industries", date: "2024-01-14", total: "₹28,500", status: "accepted" },
    { id: "QUO-003", customer: "Modern Engineering", date: "2024-01-13", total: "₹42,000", status: "pending" },
    { id: "QUO-004", customer: "Tech Solutions", date: "2024-01-12", total: "₹19,800", status: "rejected" },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive", className: string }> = {
      pending: { variant: "secondary", className: "bg-warning hover:bg-warning/90" },
      accepted: { variant: "default", className: "bg-success hover:bg-success/90" },
      rejected: { variant: "destructive", className: "" },
    };
    
    return (
      <Badge variant={variants[status].variant} className={variants[status].className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Quotations</h1>
            <p className="text-muted-foreground mt-1">Create and manage price quotations</p>
          </div>
          <Button className="gap-2" onClick={() => navigate("/quotations/create")}>
            <Plus className="h-4 w-4" />
            New Quotation
          </Button>
        </div>

        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quote No.</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotations.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">{quote.id}</TableCell>
                  <TableCell>{quote.customer}</TableCell>
                  <TableCell>{quote.date}</TableCell>
                  <TableCell className="font-semibold">{quote.total}</TableCell>
                  <TableCell>{getStatusBadge(quote.status)}</TableCell>
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

export default Quotations;

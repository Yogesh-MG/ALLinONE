import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Copy, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Motor {
  id: number;
  name: string;
  description: string;
  type: "Single Phase" | "Three Phase";
  powerRating: string;
  voltage: string;
  windingType: "Star" | "Delta";
  coilCount: string;
  pitchDetails: string;
  wireGauge: string;
  turnsPerCoil: string;
  rewindingNotes: string;
}

const MotorLibrary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMotor, setSelectedMotor] = useState<Motor | null>(null);
  const [viewMotor, setViewMotor] = useState<Motor | null>(null);

  const motors: Motor[] = [
    {
      id: 1,
      name: "Standard 1HP Single Phase",
      description: "Common 1HP motor for small applications",
      type: "Single Phase",
      powerRating: "1 HP",
      voltage: "230V",
      windingType: "Star",
      coilCount: "24",
      pitchDetails: "1-9",
      wireGauge: "22 SWG",
      turnsPerCoil: "280",
      rewindingNotes: "Use grade 1 copper wire. Check bearing clearance before assembly.",
    },
    {
      id: 2,
      name: "Industrial 5HP Three Phase",
      description: "Heavy duty 5HP three phase motor",
      type: "Three Phase",
      powerRating: "5 HP",
      voltage: "415V",
      windingType: "Delta",
      coilCount: "36",
      pitchDetails: "1-10",
      wireGauge: "18 SWG",
      turnsPerCoil: "156",
      rewindingNotes: "Double layer winding. Test insulation resistance after rewinding.",
    },
    {
      id: 3,
      name: "Pump Motor 2HP",
      description: "Water pump motor 2HP single phase",
      type: "Single Phase",
      powerRating: "2 HP",
      voltage: "230V",
      windingType: "Star",
      coilCount: "24",
      pitchDetails: "1-9",
      wireGauge: "20 SWG",
      turnsPerCoil: "198",
      rewindingNotes: "Moisture resistant insulation required. Use polyester varnish.",
    },
  ];

  const handleAddMotor = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(selectedMotor ? "Motor updated successfully!" : "Motor added successfully!");
    setIsDialogOpen(false);
    setSelectedMotor(null);
  };

  const handleEdit = (motor: Motor) => {
    setSelectedMotor(motor);
    setIsDialogOpen(true);
  };

  const handleDuplicate = (motor: Motor) => {
    setSelectedMotor({ ...motor, id: Date.now(), name: `${motor.name} (Copy)` });
    setIsDialogOpen(true);
  };

  const handleUseInQuotation = (motor: Motor) => {
    toast.success(`Motor "${motor.name}" ready to use in quotation`);
    // This would navigate to quotations page with pre-filled data
  };

  const filteredMotors = motors.filter(
    (motor) =>
      motor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      motor.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      motor.powerRating.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Motor Library</h1>
            <p className="text-muted-foreground mt-1">
              Store and manage technical motor specifications
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => setSelectedMotor(null)}>
                <Plus className="h-4 w-4" />
                Add Motor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedMotor ? "Edit Motor" : "Add New Motor"}</DialogTitle>
                <DialogDescription>Enter motor technical specifications</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddMotor} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="name">Motor Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Standard 1HP Single Phase"
                      defaultValue={selectedMotor?.name}
                      required
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Brief description"
                      defaultValue={selectedMotor?.description}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Motor Type *</Label>
                    <Select defaultValue={selectedMotor?.type || "Single Phase"}>
                      <SelectTrigger id="type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single Phase">Single Phase</SelectItem>
                        <SelectItem value="Three Phase">Three Phase</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="powerRating">Power Rating (HP) *</Label>
                    <Input
                      id="powerRating"
                      placeholder="e.g., 1 HP, 5 HP"
                      defaultValue={selectedMotor?.powerRating}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="voltage">Voltage *</Label>
                    <Input
                      id="voltage"
                      placeholder="e.g., 230V, 415V"
                      defaultValue={selectedMotor?.voltage}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="windingType">Winding Type *</Label>
                    <Select defaultValue={selectedMotor?.windingType || "Star"}>
                      <SelectTrigger id="windingType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Star">Star</SelectItem>
                        <SelectItem value="Delta">Delta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coilCount">Coil Count</Label>
                    <Input
                      id="coilCount"
                      placeholder="e.g., 24, 36"
                      defaultValue={selectedMotor?.coilCount}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pitchDetails">Pitch Details</Label>
                    <Input
                      id="pitchDetails"
                      placeholder="e.g., 1-9, 1-10"
                      defaultValue={selectedMotor?.pitchDetails}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wireGauge">Wire Gauge (SWG)</Label>
                    <Input
                      id="wireGauge"
                      placeholder="e.g., 20 SWG, 22 SWG"
                      defaultValue={selectedMotor?.wireGauge}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="turnsPerCoil">Turns per Coil</Label>
                    <Input
                      id="turnsPerCoil"
                      placeholder="e.g., 280, 156"
                      defaultValue={selectedMotor?.turnsPerCoil}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="rewindingNotes">Rewinding Notes</Label>
                    <Textarea
                      id="rewindingNotes"
                      placeholder="Special instructions, tips, or precautions..."
                      defaultValue={selectedMotor?.rewindingNotes}
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setSelectedMotor(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {selectedMotor ? "Update Motor" : "Save Motor"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, type, or HP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Motor Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Power Rating</TableHead>
                <TableHead>Voltage</TableHead>
                <TableHead>Winding Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMotors.map((motor) => (
                <TableRow key={motor.id}>
                  <TableCell className="font-medium">{motor.name}</TableCell>
                  <TableCell>
                    <Badge variant={motor.type === "Three Phase" ? "default" : "secondary"}>
                      <Zap className="h-3 w-3 mr-1" />
                      {motor.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{motor.powerRating}</TableCell>
                  <TableCell>{motor.voltage}</TableCell>
                  <TableCell>{motor.windingType}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewMotor(motor)}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(motor)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDuplicate(motor)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Motor Details View Dialog */}
      <Dialog open={!!viewMotor} onOpenChange={() => setViewMotor(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{viewMotor?.name}</DialogTitle>
            <DialogDescription>{viewMotor?.description}</DialogDescription>
          </DialogHeader>
          {viewMotor && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Motor Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant={viewMotor.type === "Three Phase" ? "default" : "secondary"}>
                      <Zap className="h-3 w-3 mr-1" />
                      {viewMotor.type}
                    </Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Power Rating
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{viewMotor.powerRating}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Voltage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-semibold">{viewMotor.voltage}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Winding Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-semibold">{viewMotor.windingType}</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Technical Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Coil Count</p>
                      <p className="font-medium">{viewMotor.coilCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pitch Details</p>
                      <p className="font-medium">{viewMotor.pitchDetails}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Wire Gauge</p>
                      <p className="font-medium">{viewMotor.wireGauge}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Turns per Coil</p>
                      <p className="font-medium">{viewMotor.turnsPerCoil}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rewinding Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{viewMotor.rewindingNotes}</p>
                </CardContent>
              </Card>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setViewMotor(null)}>
                  Close
                </Button>
                <Button onClick={() => handleUseInQuotation(viewMotor)}>
                  Use in Quotation
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default MotorLibrary;

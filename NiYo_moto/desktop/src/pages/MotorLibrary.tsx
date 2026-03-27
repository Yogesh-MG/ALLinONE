import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Copy, Zap, Info, Loader2, Trash2, Layers } from "lucide-react";
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
import api from "@/utils/api";

// --- Types ---
interface Coil {
  pitch: string;
  turns: string;
}

interface WindingSet {
  name: string; // e.g., "Main/Bottom", "Aux/Top"
  wireGauge: string;
  pitchInput: string; // Temporary state for the input field
  coils: Coil[];
}

interface Motor {
  id: number;
  name: string;
  description: string;
  type: string;
  powerRating: string;
  voltage: string;
  windingType: string;
  coilCount: string;
  windingData: WindingSet[]; // Updated to hold sets
  rewindingNotes: string;
}

const MotorLibrary = () => {
  const [motors, setMotors] = useState<Motor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMotor, setSelectedMotor] = useState<Motor | null>(null);
  const [viewMotor, setViewMotor] = useState<Motor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [motorType, setMotorType] = useState<string>("Single Phase");
  
  // Dynamic Winding Sets (e.g., [Main, Aux] or just [Phase])
  const [windingSets, setWindingSets] = useState<WindingSet[]>([]);

  // Fetch Motors
  const fetchMotors = async () => {
    setLoading(true);
    try {
        const res = await api.get("api/motors/");
        const mappedMotors = res.data.map((m: any) => ({
            id: m.id,
            name: m.name,
            description: m.description,
            type: m.motor_type,
            powerRating: m.power_rating,
            voltage: m.voltage,
            windingType: m.winding_type,
            coilCount: m.coil_count,
            // Handle backward compatibility or new structure
            windingData: Array.isArray(m.winding_data) ? m.winding_data : [],
            rewindingNotes: m.rewinding_notes
        }));
        setMotors(mappedMotors);
    } catch (error) {
        console.error(error);
        toast.error("Failed to load motors");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchMotors();
  }, []);

  // Initialize Form based on Type selection or Edit
  useEffect(() => {
    if (selectedMotor) {
      setMotorType(selectedMotor.type);
      if (selectedMotor.windingData && selectedMotor.windingData.length > 0) {
          // Deep copy to avoid mutating state directly
          setWindingSets(JSON.parse(JSON.stringify(selectedMotor.windingData)));
      } else {
          // Fallback if editing an old record without new structure
          resetWindingSets(selectedMotor.type);
      }
    } else {
      // New Entry Defaults
      resetWindingSets(motorType);
    }
  }, [selectedMotor, isDialogOpen]);

  // Helper to reset winding sets based on motor type
  const resetWindingSets = (type: string) => {
      const isSinglePhase = type === "Single Phase" || type === "Submersible Single";
      
      if (isSinglePhase) {
          setWindingSets([
              { name: "Bottom / Main Winding", wireGauge: "", pitchInput: "", coils: [] },
              { name: "Top / Aux Winding", wireGauge: "", pitchInput: "", coils: [] }
          ]);
      } else {
          // Three Phase / Submersible Three
          setWindingSets([
              { name: "Phase Winding", wireGauge: "", pitchInput: "", coils: [] }
          ]);
      }
  };

  // Handle Type Change Trigger
  const handleTypeChange = (val: string) => {
      setMotorType(val);
      // Only reset sets if we are NOT editing an existing motor (to prevent data loss on accidental switch)
      // Or if the switch fundamentally changes structure (Single <-> Three)
      const currentIsSingle = motorType.includes("Single");
      const newIsSingle = val.includes("Single");
      
      if (currentIsSingle !== newIsSingle) {
          resetWindingSets(val);
      }
  };

  // Logic to handle Pitch String parsing for a specific Set
  const handlePitchInputChange = (index: number, val: string) => {
    const newSets = [...windingSets];
    newSets[index].pitchInput = val;
    
    // Auto-generate coils
    const pitches = val.split(/[\s,]+/).filter(p => p.trim() !== "");
    const currentCoils = newSets[index].coils;
    
    const newCoils = pitches.map(p => {
        const existing = currentCoils.find(c => c.pitch === p);
        return { pitch: p, turns: existing ? existing.turns : "" };
    });
    
    newSets[index].coils = newCoils;
    setWindingSets(newSets);
  };

  const handleTurnChange = (setIndex: number, coilIndex: number, val: string) => {
    const newSets = [...windingSets];
    newSets[setIndex].coils[coilIndex].turns = val;
    setWindingSets(newSets);
  };

  const handleGaugeChange = (index: number, val: string) => {
      const newSets = [...windingSets];
      newSets[index].wireGauge = val;
      setWindingSets(newSets);
  };

  const handleSaveMotor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target as HTMLFormElement);
    
    // Flatten data for simple list view display
    const simpleGauge = windingSets.map(s => `${s.name.split('/')[0]}:${s.wireGauge}`).join(', ');
    const simplePitch = windingSets.map(s => s.pitchInput).join(' | ');

    const payload: any = {
      name: formData.get("name"),
      description: formData.get("description"),
      motor_type: motorType,
      power_rating: formData.get("powerRating"),
      voltage: formData.get("voltage"),
      winding_type: formData.get("windingType"),
      coil_count: formData.get("coilCount"),
      rewinding_notes: formData.get("rewindingNotes"),
      
      // Store the complex structure in JSON field
      winding_data: windingSets,
      
      // Store summary strings in legacy fields for easy search/display
      wire_gauge: simpleGauge,
      pitch_details: simplePitch,
      turns_per_coil: "See Data" 
    };

    try {
        if (selectedMotor) {
            await api.put(`api/motors/${selectedMotor.id}/`, payload);
            toast.success("Motor updated successfully!");
        } else {
            await api.post("api/motors/", payload);
            toast.success("Motor added successfully!");
        }
        setIsDialogOpen(false);
        setSelectedMotor(null);
        fetchMotors();
    } catch (error) {
        console.error(error);
        toast.error("Failed to save motor.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
      if(!confirm("Delete this motor template?")) return;
      try {
          await api.delete(`api/motors/${id}/`);
          toast.success("Motor deleted");
          setMotors(motors.filter(m => m.id !== id));
      } catch (error) {
          toast.error("Failed to delete");
      }
  };

  // Filter Logic
  const filteredMotors = motors.filter(
    (motor) =>
      motor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      motor.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-3xl font-bold text-foreground">Motor Library</h1>
            <p className="text-muted-foreground mt-1">Store and manage technical motor specifications</p>
            </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => setSelectedMotor(null)}>
                <Plus className="h-4 w-4" /> Add Motor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedMotor ? "Edit Motor" : "Add New Motor"}</DialogTitle>
                <DialogDescription>Enter technical winding data.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSaveMotor} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Basic Info */}
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="name">Motor Name *</Label>
                    <Input id="name" name="name" defaultValue={selectedMotor?.name} required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Motor Type *</Label>
                    <Select value={motorType} onValueChange={handleTypeChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single Phase">Single Phase</SelectItem>
                        <SelectItem value="Three Phase">Three Phase</SelectItem>
                        <SelectItem value="Submersible Single">Submersible (Single Phase)</SelectItem>
                        <SelectItem value="Submersible Three">Submersible (Three Phase)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="powerRating">Power Rating</Label>
                    <Input id="powerRating" name="powerRating" defaultValue={selectedMotor?.powerRating} placeholder="e.g. 1 HP" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="voltage">Voltage</Label>
                    <Input id="voltage" name="voltage" defaultValue={selectedMotor?.voltage} placeholder="e.g. 230V" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="windingType">Connection / Config</Label>
                    <Input id="windingType" name="windingType" defaultValue={selectedMotor?.windingType} placeholder="e.g. Star, Delta, CSCR" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coilCount">Total Slots</Label>
                    <Input id="coilCount" name="coilCount" defaultValue={selectedMotor?.coilCount} placeholder="e.g. 24" />
                  </div>

                  {/* --- DYNAMIC WINDING SETS --- */}
                  <div className="col-span-2 space-y-4">
                    {windingSets.map((set, setIndex) => (
                        <div key={setIndex} className="border rounded-md p-4 bg-slate-50 dark:bg-slate-900/50">
                            <div className="flex items-center gap-2 mb-3">
                                <Layers className="w-4 h-4 text-primary" />
                                <h3 className="font-bold text-sm text-primary">{set.name}</h3>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="space-y-2">
                                    <Label className="text-xs">Wire Gauge (SWG)</Label>
                                    <Input 
                                        value={set.wireGauge}
                                        onChange={(e) => handleGaugeChange(setIndex, e.target.value)}
                                        placeholder="e.g. 22" 
                                        className="h-8"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Pitch Series (comma separated)</Label>
                                    <Input 
                                        value={set.pitchInput}
                                        onChange={(e) => handlePitchInputChange(setIndex, e.target.value)}
                                        placeholder="e.g. 1-6, 1-8, 1-10" 
                                        className="h-8 font-mono"
                                    />
                                </div>
                            </div>

                            {/* Coil Table for this Set */}
                            {set.coils.length > 0 && (
                                <div className="border rounded bg-white dark:bg-slate-950">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="h-8">
                                                <TableHead className="h-8 text-xs">Pitch</TableHead>
                                                <TableHead className="h-8 text-xs">Turns Count</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {set.coils.map((coil, coilIndex) => (
                                                <TableRow key={coilIndex} className="h-8">
                                                    <TableCell className="py-1 font-mono text-xs font-medium">
                                                        {coil.pitch}
                                                    </TableCell>
                                                    <TableCell className="py-1">
                                                        <Input 
                                                            className="h-6 w-24 text-xs" 
                                                            value={coil.turns}
                                                            onChange={(e) => handleTurnChange(setIndex, coilIndex, e.target.value)}
                                                            placeholder="0"
                                                            type="number"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    ))}
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="rewindingNotes">Rewinding Notes</Label>
                    <Textarea
                      id="rewindingNotes"
                      name="rewindingNotes"
                      placeholder="Special instructions..."
                      defaultValue={selectedMotor?.rewindingNotes}
                      rows={2}
                    />
                  </div>
                </div>
                <div className="flex gap-3 justify-end mt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                    Save Motor Data
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* List Table */}
        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Motor Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>HP / Voltage</TableHead>
                <TableHead className="hidden md:table-cell">Config</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-4">Loading...</TableCell></TableRow>
              ) : filteredMotors.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-4">No motors found.</TableCell></TableRow>
              ) : (
                  filteredMotors.map((motor) => (
                    <TableRow key={motor.id}>
                      <TableCell className="font-medium">{motor.name}</TableCell>
                      <TableCell><Badge variant="outline">{motor.type}</Badge></TableCell>
                      <TableCell>{motor.powerRating} / {motor.voltage}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground text-sm">{motor.windingType || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => setViewMotor(motor)}>View</Button>
                            <Button variant="ghost" size="icon" onClick={() => { setSelectedMotor(motor); setIsDialogOpen(true); }}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(motor.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* DETAILED VIEW DIALOG */}
      <Dialog open={!!viewMotor} onOpenChange={() => setViewMotor(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewMotor?.name}</DialogTitle>
            <DialogDescription>{viewMotor?.type} - {viewMotor?.powerRating}</DialogDescription>
          </DialogHeader>
          
          {viewMotor && (
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg">
                    <div><span className="text-muted-foreground">Voltage:</span> <span className="font-semibold">{viewMotor.voltage}</span></div>
                    <div><span className="text-muted-foreground">Slots:</span> <span className="font-semibold">{viewMotor.coilCount}</span></div>
                    <div><span className="text-muted-foreground">Config:</span> <span className="font-semibold">{viewMotor.windingType}</span></div>
                </div>

                <div className="space-y-4">
                    {viewMotor.windingData && viewMotor.windingData.map((set, i) => (
                        <Card key={i} className="border-l-4 border-l-primary">
                            <CardHeader className="py-2 bg-muted/20">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-sm font-bold">{set.name}</CardTitle>
                                    <Badge variant="secondary">Gauge: {set.wireGauge || "N/A"}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="h-8 bg-transparent">
                                            <TableHead className="h-8">Pitch</TableHead>
                                            <TableHead className="h-8">Turns</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {set.coils.map((c, j) => (
                                            <TableRow key={j} className="h-8 border-b-0">
                                                <TableCell className="py-1 font-mono">{c.pitch}</TableCell>
                                                <TableCell className="py-1 font-bold">{c.turns}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {viewMotor.rewindingNotes && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-md border border-yellow-200 dark:border-yellow-900">
                        <h4 className="text-xs font-bold text-yellow-800 dark:text-yellow-500 uppercase mb-1">Notes</h4>
                        <p className="text-sm text-yellow-900 dark:text-yellow-200 whitespace-pre-wrap">{viewMotor.rewindingNotes}</p>
                    </div>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default MotorLibrary;
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  MapPin, 
  User,
  DollarSign,
  Activity,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const NewClassDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [classDate, setClassDate] = useState<Date>();
  const [formData, setFormData] = useState({
    name: "",
    instructor: "",
    type: "",
    capacity: "",
    startTime: "",
    endTime: "",
    location: "",
    description: "",
    price: "",
    difficulty: ""
  });

  const classTypes = [
    { value: "yoga", label: "Yoga", icon: "🧘‍♀️" },
    { value: "hiit", label: "HIIT Training", icon: "💪" },
    { value: "pilates", label: "Pilates", icon: "🤸‍♀️" },
    { value: "spinning", label: "Spinning", icon: "🚴‍♂️" },
    { value: "crossfit", label: "CrossFit", icon: "🏋️‍♂️" },
    { value: "dance", label: "Dance Fitness", icon: "💃" },
    { value: "boxing", label: "Boxing", icon: "🥊" },
    { value: "swimming", label: "Swimming", icon: "🏊‍♂️" }
  ];

  const instructors = [
    "Lisa Chen", "Mike Torres", "Sarah Williams", "David Kim", "Emma Rodriguez", "James Wilson"
  ];

  const locations = [
    "Main gym floor", "Studio A", "Studio B", "Cycling Studio", "Pool Area", "Training Room 1", "Training Room 2"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!classDate) {
      toast({
        title: "Date Required",
        description: "Please select a date for the class.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Class Created Successfully! ✨",
      description: `${formData.name} has been scheduled for ${format(classDate, "PPP")} at ${formData.startTime}`,
    });
    
    // Reset form
    setFormData({
      name: "",
      instructor: "",
      type: "",
      capacity: "",
      startTime: "",
      endTime: "",
      location: "",
      description: "",
      price: "",
      difficulty: ""
    });
    setClassDate(undefined);
    setOpen(false);
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return <Badge className="bg-success/10 text-success">Beginner</Badge>;
      case "intermediate":
        return <Badge className="bg-warning/10 text-warning">Intermediate</Badge>;
      case "advanced":
        return <Badge className="bg-destructive/10 text-destructive">Advanced</Badge>;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 hover:scale-105 transition-all duration-200 bg-gradient-to-r from-primary to-accent">
          <Plus className="h-4 w-4" />
          New Class
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Activity className="h-6 w-6 text-primary" />
            Create New Class
            <Sparkles className="h-5 w-5 text-accent animate-pulse" />
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Activity className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-lg">Basic Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="className">Class Name</Label>
                <Input 
                  id="className" 
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Morning Yoga Flow"
                  className="transition-all duration-200 focus:scale-[1.02]"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="classType">Class Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger className="transition-all duration-200 focus:scale-[1.02]">
                    <SelectValue placeholder="Select class type" />
                  </SelectTrigger>
                  <SelectContent>
                    {classTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor</Label>
                <Select value={formData.instructor} onValueChange={(value) => handleInputChange('instructor', value)}>
                  <SelectTrigger className="transition-all duration-200 focus:scale-[1.02]">
                    <SelectValue placeholder="Select instructor" />
                  </SelectTrigger>
                  <SelectContent>
                    {instructors.map((instructor) => (
                      <SelectItem key={instructor} value={instructor}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{instructor}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input 
                  id="capacity" 
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  placeholder="e.g., 20"
                  className="transition-all duration-200 focus:scale-[1.02]"
                  min="1"
                  max="50"
                  required 
                />
              </div>
            </div>
          </div>

          {/* Schedule & Location */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-lg">Schedule & Location</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Class Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal transition-all duration-200 focus:scale-[1.02]",
                        !classDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {classDate ? format(classDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={classDate}
                      onSelect={setClassDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input 
                  id="startTime" 
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  className="transition-all duration-200 focus:scale-[1.02]"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input 
                  id="endTime" 
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className="transition-all duration-200 focus:scale-[1.02]"
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                <SelectTrigger className="transition-all duration-200 focus:scale-[1.02]">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{location}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-lg">Additional Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input 
                  id="price" 
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="e.g., 25"
                  className="transition-all duration-200 focus:scale-[1.02]"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                  <SelectTrigger className="transition-all duration-200 focus:scale-[1.02]">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success"></div>
                        <span>Beginner</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="intermediate">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-warning"></div>
                        <span>Intermediate</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="advanced">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-destructive"></div>
                        <span>Advanced</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Class Description</Label>
              <Textarea 
                id="description" 
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the class, what to expect, what to bring, etc."
                className="min-h-24 transition-all duration-200 focus:scale-[1.02]"
              />
            </div>
          </div>

          {/* Preview Card */}
          {formData.name && (
            <div className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border-2 border-dashed border-primary/20">
              <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Class Preview
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xl font-bold">{formData.name}</h5>
                  <div className="flex gap-2">
                    {formData.difficulty && getDifficultyBadge(formData.difficulty)}
                    {formData.type && <Badge variant="outline" className="capitalize">{formData.type}</Badge>}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {formData.instructor && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span>{formData.instructor}</span>
                    </div>
                  )}
                  {classDate && formData.startTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>{format(classDate, "MMM d")} at {formData.startTime}</span>
                    </div>
                  )}
                  {formData.capacity && (
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span>{formData.capacity} spots</span>
                    </div>
                  )}
                  {formData.price && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                      <span>${formData.price}</span>
                    </div>
                  )}
                </div>
                {formData.description && (
                  <p className="text-sm text-muted-foreground mt-2">{formData.description}</p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="hover:scale-105 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="hover:scale-105 transition-all duration-200 bg-gradient-to-r from-primary to-accent"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Class
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
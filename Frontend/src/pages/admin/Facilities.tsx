import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Monitor } from "lucide-react";

const facilities = [
  { name: "Computer Lab 1", type: "Lab", capacity: 40, status: "available", equipment: "40 PCs, Projector" },
  { name: "Computer Lab 2", type: "Lab", capacity: 35, status: "in-use", equipment: "35 PCs, Projector, Whiteboard" },
  { name: "Room 301", type: "Lecture", capacity: 50, status: "available", equipment: "Projector, Whiteboard" },
  { name: "Room 302", type: "Lecture", capacity: 45, status: "maintenance", equipment: "Projector" },
  { name: "AVR", type: "Multi-purpose", capacity: 100, status: "available", equipment: "Sound System, Projector, Stage" },
];

const statusColors: Record<string, string> = { available: "default", "in-use": "secondary", maintenance: "destructive" };

const AdminFacilities = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2"><Building className="h-6 w-6 text-primary" /> Facilities</h1>
      <p className="text-muted-foreground text-sm">Manage rooms, computer labs, and availability</p>
    </div>

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {facilities.map((f, i) => (
        <Card key={i} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg flex items-center gap-2">
                {f.type === "Lab" ? <Monitor className="h-5 w-5 text-primary" /> : <Building className="h-5 w-5 text-primary" />}
                {f.name}
              </CardTitle>
              <Badge variant={statusColors[f.status] as any} className="capitalize">{f.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">Type: <span className="text-foreground font-medium">{f.type}</span></p>
              <p className="text-muted-foreground">Capacity: <span className="text-foreground font-medium">{f.capacity} seats</span></p>
              <p className="text-muted-foreground">Equipment: <span className="text-foreground font-medium">{f.equipment}</span></p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default AdminFacilities;

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Clock } from "lucide-react";

const events = [
  { title: "CCS Week 2024", type: "Curricular", date: "Apr 15-19, 2024", location: "CCS Building", status: "upcoming", joined: false },
  { title: "Hackathon: Code for Change", type: "Extra-curricular", date: "Apr 5, 2024", location: "Lab 1 & 2", status: "upcoming", joined: true },
  { title: "IT Career Talk", type: "Seminar", date: "Mar 25, 2024", location: "AVR", status: "completed", joined: true },
  { title: "Programming Contest", type: "Competition", date: "Mar 20, 2024", location: "Lab 1", status: "completed", joined: true },
];

const StudentEvents = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2"><CalendarDays className="h-6 w-6 text-primary" /> Events</h1>
      <p className="text-muted-foreground text-sm">View and join upcoming events</p>
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      {events.map((e, i) => (
        <Card key={i} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardContent className="p-5">
            <div className="flex justify-between mb-2">
              <Badge variant="outline">{e.type}</Badge>
              <Badge variant={e.status === "upcoming" ? "default" : "secondary"} className="capitalize">{e.status}</Badge>
            </div>
            <h3 className="text-lg font-semibold mb-2">{e.title}</h3>
            <div className="space-y-1 text-sm text-muted-foreground mb-4">
              <p className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5" />{e.date}</p>
              <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{e.location}</p>
            </div>
            {e.status === "upcoming" && (
              <Button variant={e.joined ? "secondary" : "default"} size="sm" className="w-full transition-all duration-200 hover:scale-[1.02]">
                {e.joined ? "✓ Joined" : "Join Event"}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default StudentEvents;

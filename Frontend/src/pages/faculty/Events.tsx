import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Users, Plus } from "lucide-react";

const events = [
  { title: "CCS Week 2024", type: "Curricular", date: "Apr 15-19, 2024", location: "CCS Building", role: "Organizer", participants: 320 },
  { title: "Hackathon: Code for Change", type: "Extra-curricular", date: "Apr 5, 2024", location: "Lab 1 & 2", role: "Adviser", participants: 60 },
  { title: "IT Career Talk", type: "Seminar", date: "Mar 25, 2024", location: "AVR", role: "Speaker", participants: 150 },
];

const FacultyEvents = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2"><CalendarDays className="h-6 w-6 text-primary" /> Events</h1>
        <p className="text-muted-foreground text-sm">Create and manage curricular & extra-curricular events</p>
      </div>
      <Button className="gap-2 transition-all duration-200 hover:scale-105"><Plus className="h-4 w-4" /> Create Event</Button>
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      {events.map((e, i) => (
        <Card key={i} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardContent className="p-5">
            <div className="flex justify-between mb-2">
              <Badge variant="outline">{e.type}</Badge>
              <Badge>{e.role}</Badge>
            </div>
            <h3 className="text-lg font-semibold mb-2">{e.title}</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5" />{e.date}</p>
              <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{e.location}</p>
              <p className="flex items-center gap-2"><Users className="h-3.5 w-3.5" />{e.participants} participants</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default FacultyEvents;

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Plus, Trophy } from "lucide-react";

const achievements = [
  { student: "Maria Santos", title: "1st Place - Hackathon 2024", category: "Academic", status: "Approved", date: "Mar 28, 2024" },
  { student: "Pedro Lim", title: "Best Research Paper - IT Congress", category: "Academic", status: "Pending", date: "Mar 25, 2024" },
  { student: "Carlos Mendoza", title: "MVP - Basketball Intramurals", category: "Non-Academic", status: "Approved", date: "Mar 15, 2024" },
];

const FacultyAchievements = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2"><Award className="h-6 w-6 text-primary" /> Achievements</h1>
        <p className="text-muted-foreground text-sm">Record and submit student achievements for verification</p>
      </div>
      <Button className="gap-2 transition-all duration-200 hover:scale-105"><Plus className="h-4 w-4" /> Add Achievement</Button>
    </div>
    <div className="space-y-3">
      {achievements.map((a, i) => (
        <Card key={i} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><Trophy className="h-5 w-5 text-primary" /></div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground">{a.title}</h3>
              <p className="text-sm text-muted-foreground">Student: {a.student} • {a.date}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Badge variant="outline">{a.category}</Badge>
              <Badge variant={a.status === "Approved" ? "default" : "secondary"}>{a.status}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default FacultyAchievements;

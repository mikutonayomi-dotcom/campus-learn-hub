import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Trophy, Star } from "lucide-react";

const achievements = [
  { title: "1st Place - Hackathon 2024", category: "Academic", date: "Mar 28, 2024", status: "Verified" },
  { title: "Dean's Lister - 1st Sem 2024", category: "Academic", date: "Feb 15, 2024", status: "Verified" },
  { title: "Best UI Design - IT Expo", category: "Academic", date: "Jan 20, 2024", status: "Verified" },
];

const skills = ["Programming", "Web Development", "UI/UX Design", "Database Management"];

const StudentAchievements = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2"><Award className="h-6 w-6 text-primary" /> Achievements & Skills</h1>
      <p className="text-muted-foreground text-sm">View your awards and manage your skills</p>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-3">
        <h2 className="text-lg font-display font-semibold flex items-center gap-2"><Trophy className="h-5 w-5 text-primary" /> Awards</h2>
        {achievements.map((a, i) => (
          <Card key={i} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><Trophy className="h-5 w-5 text-primary" /></div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{a.title}</h3>
                <p className="text-xs text-muted-foreground">{a.date}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Badge variant="outline">{a.category}</Badge>
                <Badge>{a.status}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-display font-semibold flex items-center gap-2 mb-3"><Star className="h-5 w-5 text-primary" /> Skills</h2>
        <Card className="transition-shadow duration-300 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <Badge key={s} variant="secondary" className="px-3 py-1.5 text-sm transition-transform duration-200 hover:scale-105 cursor-pointer">{s}</Badge>
              ))}
              <Badge variant="outline" className="px-3 py-1.5 text-sm cursor-pointer border-dashed transition-all duration-200 hover:bg-primary/10">+ Add Skill</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

export default StudentAchievements;

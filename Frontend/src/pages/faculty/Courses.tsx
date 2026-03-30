import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, FileText, Video, Link } from "lucide-react";

const courses = [
  {
    code: "IT101", name: "Introduction to Computing", section: "1A",
    materials: [
      { title: "Chapter 1 - History of Computing", type: "PDF", date: "Mar 25" },
      { title: "Lecture 1 Video", type: "Video", date: "Mar 20" },
    ]
  },
  {
    code: "IT301", name: "Web Development", section: "3A",
    materials: [
      { title: "HTML/CSS Basics", type: "PDF", date: "Mar 28" },
      { title: "React Tutorial Link", type: "Link", date: "Mar 27" },
      { title: "Project Guidelines", type: "PDF", date: "Mar 15" },
    ]
  },
];

const typeIcons: Record<string, React.ElementType> = { PDF: FileText, Video: Video, Link: Link };

const FacultyCourses = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2"><BookOpen className="h-6 w-6 text-primary" /> Courses & Materials</h1>
        <p className="text-muted-foreground text-sm">Manage syllabus, lessons, and learning materials</p>
      </div>
      <Button className="gap-2 transition-all duration-200 hover:scale-105"><Plus className="h-4 w-4" /> Upload Material</Button>
    </div>
    {courses.map((c) => (
      <Card key={c.code} className="transition-shadow duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-primary font-mono">{c.code}</span> {c.name}
            <Badge variant="outline" className="ml-auto">Section {c.section}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {c.materials.map((m, i) => {
              const Icon = typeIcons[m.type] || FileText;
              return (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 transition-all duration-200 hover:bg-muted cursor-pointer group">
                  <Icon className="h-4 w-4 text-primary shrink-0 transition-transform duration-200 group-hover:scale-110" />
                  <span className="flex-1 text-sm font-medium">{m.title}</span>
                  <Badge variant="secondary" className="text-xs">{m.type}</Badge>
                  <span className="text-xs text-muted-foreground">{m.date}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default FacultyCourses;

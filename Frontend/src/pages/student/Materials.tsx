import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderOpen, FileText, Video, Link, Download } from "lucide-react";

const materials = [
  { subject: "IT301", title: "HTML/CSS Basics", type: "PDF", date: "Mar 28, 2024", size: "2.4 MB" },
  { subject: "IT301", title: "React Tutorial", type: "Link", date: "Mar 27, 2024", size: "-" },
  { subject: "IT302", title: "SQL Fundamentals", type: "PDF", date: "Mar 25, 2024", size: "1.8 MB" },
  { subject: "IT301", title: "JavaScript ES6 Video", type: "Video", date: "Mar 22, 2024", size: "150 MB" },
  { subject: "IT303", title: "SDLC Models", type: "PDF", date: "Mar 20, 2024", size: "3.1 MB" },
];

const typeIcons: Record<string, React.ElementType> = { PDF: FileText, Video: Video, Link: Link };

const StudentMaterials = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2"><FolderOpen className="h-6 w-6 text-primary" /> Learning Materials</h1>
      <p className="text-muted-foreground text-sm">Access lessons, modules, and uploaded resources</p>
    </div>
    <div className="space-y-2">
      {materials.map((m, i) => {
        const Icon = typeIcons[m.type] || FileText;
        return (
          <Card key={i} className="transition-all duration-200 hover:shadow-md hover:translate-x-1 cursor-pointer group">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{m.title}</p>
                <p className="text-xs text-muted-foreground">{m.subject} • {m.date} {m.size !== "-" && `• ${m.size}`}</p>
              </div>
              <Badge variant="outline" className="text-xs shrink-0">{m.type}</Badge>
              {m.type !== "Link" && <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"><Download className="h-4 w-4" /></Button>}
            </CardContent>
          </Card>
        );
      })}
    </div>
  </div>
);

export default StudentMaterials;

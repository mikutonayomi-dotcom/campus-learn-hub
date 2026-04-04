import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, GraduationCap } from "lucide-react";

const mockResults = [
  { name: "Maria Santos", course: "BSIT", section: "3A", gpa: "1.5", skills: ["Programming", "Web Dev"], violations: 0, achievements: 3 },
  { name: "Carlos Mendoza", course: "BSIT", section: "1A", gpa: "1.75", skills: ["Basketball", "Programming"], violations: 0, achievements: 1 },
  { name: "Ana Cruz", course: "BSIT", section: "2B", gpa: "2.0", skills: ["Volleyball", "Design"], violations: 1, achievements: 2 },
  { name: "Pedro Lim", course: "BSIT", section: "3A", gpa: "1.25", skills: ["Programming", "AI/ML"], violations: 0, achievements: 5 },
];

const AdminSearch = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2"><Search className="h-6 w-6 text-primary" /> Advanced Search</h1>
        <p className="text-muted-foreground text-sm">Filter students by skills, grades, violations, achievements, and more</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by skill, name, or query..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Filters</SelectItem>
                <SelectItem value="skills">By Skills</SelectItem>
                <SelectItem value="gpa">By GPA</SelectItem>
                <SelectItem value="violations">No Violations</SelectItem>
                <SelectItem value="achievements">Top Achievers</SelectItem>
              </SelectContent>
            </Select>
            <Button className="gap-2"><Filter className="h-4 w-4" /> Search</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {mockResults.map((r, i) => (
          <Card key={i} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"><GraduationCap className="h-5 w-5 text-primary" /></div>
                <div>
                  <h3 className="font-semibold">{r.name}</h3>
                  <p className="text-sm text-muted-foreground">{r.course} - {r.section} • GPA: {r.gpa}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {r.skills.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>Violations: <span className={r.violations === 0 ? "text-green-600" : "text-destructive"}>{r.violations}</span></span>
                <span>Achievements: <span className="text-primary font-semibold">{r.achievements}</span></span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminSearch;

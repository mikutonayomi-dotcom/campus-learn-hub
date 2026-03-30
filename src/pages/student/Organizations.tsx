import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UsersRound, User, BookOpen } from "lucide-react";

const organizations = [
  {
    name: "CCS Student Council",
    role: "Member",
    adviser: "Prof. Garcia",
    members: 45,
    description: "Official student government body of the College of Computing Studies"
  },
  {
    name: "IT Society",
    role: "Officer",
    adviser: "Prof. Reyes",
    members: 80,
    description: "Organization for IT students focused on tech events and workshops"
  },
  {
    name: "Google Developer Student Club",
    role: "Member",
    adviser: "Prof. Santos",
    members: 120,
    description: "Google-supported club for student developers"
  },
];

const StudentOrganizations = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2"><UsersRound className="h-6 w-6 text-primary" /> Organizations</h1>
      <p className="text-muted-foreground text-sm">View your organization memberships and details</p>
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {organizations.map((org, i) => (
        <Card key={i} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base">{org.name}</CardTitle>
              <Badge variant={org.role === "Officer" ? "default" : "secondary"}>{org.role}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">{org.description}</p>
            <div className="space-y-1.5 text-sm">
              <p className="flex items-center gap-2 text-muted-foreground"><BookOpen className="h-3.5 w-3.5" /> Adviser: <span className="text-foreground font-medium">{org.adviser}</span></p>
              <p className="flex items-center gap-2 text-muted-foreground"><User className="h-3.5 w-3.5" /> Members: <span className="text-foreground font-medium">{org.members}</span></p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default StudentOrganizations;

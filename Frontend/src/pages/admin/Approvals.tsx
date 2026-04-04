import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";

const pendingItems = [
  { id: 1, type: "Violation", title: "Academic dishonesty report", submittedBy: "Prof. Garcia", student: "Carlos Mendoza", date: "Mar 30, 2024" },
  { id: 2, type: "Achievement", title: "1st Place - Hackathon 2024", submittedBy: "Prof. Reyes", student: "Maria Santos", date: "Mar 29, 2024" },
  { id: 3, type: "Credential", title: "Medical Certificate Upload", submittedBy: "Ana Cruz", student: "Ana Cruz", date: "Mar 28, 2024" },
  { id: 4, type: "Event", title: "CCS Week 2024 Proposal", submittedBy: "Prof. Garcia", student: "-", date: "Mar 27, 2024" },
];

const AdminApprovals = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2"><Clock className="h-6 w-6 text-primary" /> Approvals</h1>
      <p className="text-muted-foreground text-sm">Review and approve pending submissions</p>
    </div>

    <div className="grid gap-4">
      {pendingItems.map((item) => (
        <Card key={item.id} className="transition-all duration-200 hover:shadow-lg group">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">{item.type}</Badge>
                  <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
                </div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">Submitted by {item.submittedBy} {item.student !== "-" && `• Student: ${item.student}`}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="gap-1 transition-all duration-200 hover:scale-105"><CheckCircle className="h-4 w-4" /> Approve</Button>
                <Button size="sm" variant="destructive" className="gap-1 transition-all duration-200 hover:scale-105"><XCircle className="h-4 w-4" /> Reject</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default AdminApprovals;

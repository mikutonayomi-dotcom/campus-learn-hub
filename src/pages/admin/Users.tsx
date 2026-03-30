import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, MoreHorizontal, Shield, BookOpen, GraduationCap } from "lucide-react";

const mockUsers = [
  { id: 1, name: "Maria Santos", email: "maria@uc.edu.ph", role: "student", status: "active", course: "BSIT", section: "3A" },
  { id: 2, name: "Jose Reyes", email: "jose@uc.edu.ph", role: "faculty", status: "active", course: "-", section: "-" },
  { id: 3, name: "Ana Cruz", email: "ana@uc.edu.ph", role: "student", status: "pending", course: "BSIT", section: "2B" },
  { id: 4, name: "Carlos Mendoza", email: "carlos@uc.edu.ph", role: "student", status: "active", course: "BSIT", section: "1A" },
  { id: 5, name: "Prof. Garcia", email: "garcia@uc.edu.ph", role: "faculty", status: "active", course: "-", section: "-" },
];

const roleIcons = { admin: Shield, faculty: BookOpen, student: GraduationCap };

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const filtered = mockUsers.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground text-sm">Manage students, faculty, and admin accounts</p>
        </div>
        <Button className="gap-2 transition-all duration-200 hover:scale-105"><UserPlus className="h-4 w-4" /> Add User</Button>
      </div>

      <Card className="transition-shadow duration-300 hover:shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => {
                const Icon = roleIcons[user.role as keyof typeof roleIcons] || GraduationCap;
                return (
                  <TableRow key={user.id} className="transition-colors duration-150 hover:bg-muted/50">
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1 capitalize"><Icon className="h-3 w-3" />{user.role}</Badge>
                    </TableCell>
                    <TableCell>{user.course}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : "secondary"} className="capitalize">{user.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;

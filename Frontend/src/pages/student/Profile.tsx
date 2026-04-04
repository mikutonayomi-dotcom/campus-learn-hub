import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GraduationCap, Save, Camera } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const StudentProfile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    contactNumber: "",
    address: "",
    emergencyContact: "",
    emergencyContactNumber: "",
    studentId: "",
    course: "BSIT",
    section: "",
    yearLevel: "",
  });

  const handleChange = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2"><GraduationCap className="h-6 w-6 text-primary" /> My Profile</h1>
        <p className="text-muted-foreground text-sm">Update your personal information and documents</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 transition-shadow duration-300 hover:shadow-lg">
          <CardContent className="p-6 flex flex-col items-center">
            <div className="relative group cursor-pointer">
              <Avatar className="h-24 w-24 transition-transform duration-200 group-hover:scale-105">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">{form.fullName?.[0]?.toUpperCase() || "S"}</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="mt-4 font-semibold text-foreground">{form.fullName || "Student"}</h3>
            <p className="text-sm text-muted-foreground">{form.studentId || "No ID yet"}</p>
            <p className="text-sm text-primary font-medium mt-1">{form.course} - {form.section || "N/A"}</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 transition-shadow duration-300 hover:shadow-lg">
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Full Name", field: "fullName", placeholder: "Juan Dela Cruz" },
                { label: "Email", field: "email", placeholder: "you@uc.edu.ph", disabled: true },
                { label: "Student ID", field: "studentId", placeholder: "2024-00001" },
                { label: "Contact Number", field: "contactNumber", placeholder: "09XX XXX XXXX" },
                { label: "Year Level", field: "yearLevel", placeholder: "3rd Year" },
                { label: "Section", field: "section", placeholder: "3A" },
                { label: "Address", field: "address", placeholder: "Cabuyao, Laguna" },
                { label: "Emergency Contact", field: "emergencyContact", placeholder: "Parent/Guardian name" },
                { label: "Emergency Contact #", field: "emergencyContactNumber", placeholder: "09XX XXX XXXX" },
              ].map((f) => (
                <div key={f.field} className="space-y-1.5">
                  <Label>{f.label}</Label>
                  <Input value={form[f.field as keyof typeof form]} onChange={(e) => handleChange(f.field, e.target.value)} placeholder={f.placeholder} disabled={f.disabled} className="transition-all duration-200 focus:scale-[1.01]" />
                </div>
              ))}
            </div>
            <Button className="mt-6 gap-2 transition-all duration-200 hover:scale-[1.02]"><Save className="h-4 w-4" /> Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentProfile;

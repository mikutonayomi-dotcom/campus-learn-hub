import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings, Bell, Shield, Database } from "lucide-react";

const AdminSettings = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2"><Settings className="h-6 w-6 text-primary" /> Settings</h1>
      <p className="text-muted-foreground text-sm">System configuration and preferences</p>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="transition-shadow duration-300 hover:shadow-lg">
        <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /> Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {["Email notifications", "New user alerts", "Violation alerts", "Achievement submissions"].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <Label>{item}</Label>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="transition-shadow duration-300 hover:shadow-lg">
        <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Security</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {["Require email verification", "Two-factor authentication", "Auto-logout after inactivity", "Password complexity rules"].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <Label>{item}</Label>
              <Switch defaultChecked={item.includes("email") || item.includes("Password")} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="transition-shadow duration-300 hover:shadow-lg">
        <CardHeader><CardTitle className="flex items-center gap-2"><Database className="h-5 w-5 text-primary" /> System</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Academic Year</Label>
            <span className="text-sm font-medium text-foreground">2024-2025</span>
          </div>
          <div className="flex items-center justify-between">
            <Label>Semester</Label>
            <span className="text-sm font-medium text-foreground">2nd Semester</span>
          </div>
          <Button className="w-full mt-2 transition-all duration-200 hover:scale-[1.02]">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default AdminSettings;

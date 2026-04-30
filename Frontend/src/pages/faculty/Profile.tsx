import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, Mail, Phone, MapPin, Calendar, Briefcase, 
  Edit2, Save, Loader2, GraduationCap, Building, Camera
} from "lucide-react";
import { useFacultyProfile, useUpdateFacultyProfileImage, useUpdateFacultyProfile } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

const FacultyProfile = () => {
  const { data: profile, isLoading, refetch } = useFacultyProfile();
  const { toast } = useToast();
  const updateProfileImage = useUpdateFacultyProfileImage();
  const updateProfile = useUpdateFacultyProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    contact_number: '',
    address: '',
    office_location: '',
    specialization: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await updateProfileImage.mutateAsync(file);
        toast({ title: "Profile image updated successfully" });
        refetch();
      } catch (error) {
        toast({ title: "Failed to upload image", variant: "destructive" });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleEdit = () => {
    setEditForm({
      contact_number: profile?.contact_number || '',
      address: profile?.address || '',
      office_location: profile?.office_location || '',
      specialization: profile?.specialization || '',
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(editForm);
      toast({ title: "Profile updated successfully" });
      setIsEditing(false);
      refetch();
    } catch (error) {
      toast({ title: "Failed to update profile", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Profile Header */}
      <Card className="border-2 border-primary/20 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600" />
        <CardContent className="pt-0 -mt-16 px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
            <div className="relative">
              <div className="h-32 w-32 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-4xl font-bold overflow-hidden border-4 border-background shadow-lg">
                {profile?.user?.profile_image ? (
                  <img 
                    src={`http://localhost:8000/storage/${profile.user.profile_image}`} 
                    alt="Profile" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  profile?.user?.name?.[0]?.toUpperCase() || 'F'
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full p-0 bg-background shadow-md hover:bg-accent"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            <div className="flex-1 mb-2">
              <h1 className="text-3xl font-display font-bold text-foreground">
                {profile?.user?.name}
              </h1>
              <p className="text-muted-foreground text-lg">{profile?.employee_id}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary" className="text-sm px-3 py-1">{profile?.department}</Badge>
                <Badge variant="secondary" className="text-sm px-3 py-1">{profile?.position}</Badge>
                <Badge variant="secondary" className="text-sm px-3 py-1">{profile?.employment_status || 'Full-time'}</Badge>
              </div>
            </div>
            <Button onClick={handleEdit} size="lg" className="shadow-md">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/50">
          <TabsTrigger value="personal" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Personal</TabsTrigger>
          <TabsTrigger value="professional" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Professional</TabsTrigger>
          <TabsTrigger value="contact" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  <p className="text-sm">{profile?.user?.name}</p>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Birthday
                  </Label>
                  <p className="text-sm">{profile?.birthday || 'Not specified'}</p>
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <p className="text-sm capitalize">{profile?.gender || 'Not specified'}</p>
                </div>
                <div className="space-y-2">
                  <Label>Birthplace</Label>
                  <p className="text-sm">{profile?.birthplace || 'Not specified'}</p>
                </div>
                <div className="space-y-2">
                  <Label>Religion</Label>
                  <p className="text-sm">{profile?.religion || 'Not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional">
          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Department
                  </Label>
                  <p className="text-sm">{profile?.department}</p>
                </div>
                <div className="space-y-2">
                  <Label>Position</Label>
                  <p className="text-sm">{profile?.position}</p>
                </div>
                <div className="space-y-2">
                  <Label>Employment Status</Label>
                  <p className="text-sm capitalize">{profile?.employment_status || 'Full-time'}</p>
                </div>
                <div className="space-y-2">
                  <Label>Specialization</Label>
                  <p className="text-sm">{profile?.specialization || 'Not specified'}</p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Educational Attainment
                  </Label>
                  <p className="text-sm">{profile?.educational_attainment || 'Not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <p className="text-sm">{profile?.user?.email}</p>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Contact Number
                  </Label>
                  <p className="text-sm">{profile?.contact_number || 'Not specified'}</p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                  </Label>
                  <p className="text-sm">{profile?.address || 'Not specified'}</p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Office Location
                  </Label>
                  <p className="text-sm">{profile?.office_location || 'Not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your contact information and professional details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Contact Number</Label>
              <Input
                value={editForm.contact_number}
                onChange={(e) => setEditForm({ ...editForm, contact_number: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Textarea
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Office Location</Label>
              <Input
                value={editForm.office_location}
                onChange={(e) => setEditForm({ ...editForm, office_location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Specialization</Label>
              <Input
                value={editForm.specialization}
                onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FacultyProfile;

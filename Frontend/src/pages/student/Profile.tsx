import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, Mail, Phone, MapPin, Calendar, GraduationCap, 
  Edit2, Save, Loader2, Star, Briefcase, Camera, FileText, Upload, X
} from "lucide-react";
import { useMyProfile, useMySkills, useUpdateProfileImage, useMedicalRecords, useCreateMedicalRecord, useSkills, useAddSkillToStudent, useRemoveSkillFromStudent, useUpdateProfile } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

const StudentProfile = () => {
  const { data: profile, isLoading, refetch } = useMyProfile();
  const { data: skills } = useMySkills();
  const { data: allSkills } = useSkills();
  const { data: medicalRecords, isLoading: medicalRecordsLoading } = useMedicalRecords();
  const { toast } = useToast();
  const updateProfileImage = useUpdateProfileImage();
  const createMedicalRecord = useCreateMedicalRecord();
  const addSkillToStudent = useAddSkillToStudent();
  const removeSkillFromStudent = useRemoveSkillFromStudent();
  const updateProfile = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadMedicalOpen, setIsUploadMedicalOpen] = useState(false);
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    contact_number: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_number: '',
  });
  const [medicalForm, setMedicalForm] = useState({
    title: '',
    description: '',
    record_date: new Date().toISOString().split('T')[0],
  });
  const [medicalFile, setMedicalFile] = useState<File | null>(null);
  const [skillForm, setSkillForm] = useState({ skill_id: '', level: 'beginner' });
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

  const handleMedicalUpload = async () => {
    if (!medicalFile) {
      toast({ title: "Please select a file", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    formData.append('file', medicalFile);
    formData.append('title', medicalForm.title);
    formData.append('description', medicalForm.description);
    formData.append('record_date', medicalForm.record_date);

    try {
      await createMedicalRecord.mutateAsync(formData);
      toast({ title: "Medical record uploaded successfully" });
      setIsUploadMedicalOpen(false);
      setMedicalForm({ title: '', description: '', record_date: new Date().toISOString().split('T')[0] });
      setMedicalFile(null);
    } catch (error) {
      toast({ title: "Failed to upload medical record", variant: "destructive" });
    }
  };

  const handleAddSkill = async () => {
    if (!skillForm.skill_id) {
      toast({ title: "Please select a skill", variant: "destructive" });
      return;
    }

    try {
      await addSkillToStudent.mutateAsync({
        student_id: profile?.id,
        skill_id: parseInt(skillForm.skill_id),
        level: skillForm.level,
      });
      toast({ title: "Skill added successfully" });
      setIsAddSkillOpen(false);
      setSkillForm({ skill_id: '', level: 'beginner' });
    } catch (error) {
      toast({ title: "Failed to add skill", variant: "destructive" });
    }
  };

  const handleRemoveSkill = async (skillId: number) => {
    try {
      await removeSkillFromStudent.mutateAsync({
        student_id: profile?.id,
        skill_id: skillId,
      });
      toast({ title: "Skill removed successfully" });
    } catch (error) {
      toast({ title: "Failed to remove skill", variant: "destructive" });
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
      emergency_contact_name: profile?.emergency_contact_name || '',
      emergency_contact_number: profile?.emergency_contact_number || '',
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
                  profile?.user?.name?.[0]?.toUpperCase() || 'S'
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
              <p className="text-muted-foreground text-lg">{profile?.student_id}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary" className="text-sm px-3 py-1">{profile?.course?.name}</Badge>
                <Badge variant="secondary" className="text-sm px-3 py-1">Year {profile?.year_level}</Badge>
                <Badge variant="secondary" className="text-sm px-3 py-1">{profile?.section?.name}</Badge>
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
        <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50">
          <TabsTrigger value="personal" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Personal</TabsTrigger>
          <TabsTrigger value="academic" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Academic</TabsTrigger>
          <TabsTrigger value="contact" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Contact</TabsTrigger>
          <TabsTrigger value="skills" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Skills</TabsTrigger>
          <TabsTrigger value="medical" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Medical</TabsTrigger>
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

        <TabsContent value="academic">
          <Card>
            <CardHeader>
              <CardTitle>Academic Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Course
                  </Label>
                  <p className="text-sm">{profile?.course?.name}</p>
                </div>
                <div className="space-y-2">
                  <Label>Year Level</Label>
                  <p className="text-sm">{profile?.year_level}</p>
                </div>
                <div className="space-y-2">
                  <Label>Section</Label>
                  <p className="text-sm">{profile?.section?.name || 'Not assigned'}</p>
                </div>
                <div className="space-y-2">
                  <Label>Semester</Label>
                  <p className="text-sm">{profile?.semester || 'Not specified'}</p>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <p className="text-sm capitalize">{profile?.status || 'Regular'}</p>
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
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-3">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Contact Name</Label>
                    <p className="text-sm">{profile?.emergency_contact_name || 'Not specified'}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Number</Label>
                    <p className="text-sm">{profile?.emergency_contact_number || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Skills</CardTitle>
                <Dialog open={isAddSkillOpen} onOpenChange={setIsAddSkillOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Star className="h-4 w-4 mr-2" />
                      Add Skill
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Skill</DialogTitle>
                      <DialogDescription>
                        Add a new skill to your profile with proficiency level.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Skill</Label>
                        <select
                          value={skillForm.skill_id}
                          onChange={(e) => setSkillForm({ ...skillForm, skill_id: e.target.value })}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="">Select a skill</option>
                          {allSkills?.map((skill: any) => (
                            <option key={skill.id} value={skill.id}>
                              {skill.name} ({skill.category})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Proficiency Level</Label>
                        <select
                          value={skillForm.level}
                          onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                          <option value="expert">Expert</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddSkillOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddSkill} disabled={addSkillToStudent.isPending}>
                        {addSkillToStudent.isPending ? 'Adding...' : 'Add Skill'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {skills && skills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {skills.map((skill: any) => (
                    <div key={skill.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Briefcase className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{skill.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{skill.pivot?.level || 'Beginner'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {skill.pivot?.is_verified && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleRemoveSkill(skill.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Star className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No skills added yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Medical Records</CardTitle>
                <Dialog open={isUploadMedicalOpen} onOpenChange={setIsUploadMedicalOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Record
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Medical Record</DialogTitle>
                      <DialogDescription>Upload a medical document (PDF, DOC, DOCX, JPG, PNG)</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={medicalForm.title}
                          onChange={(e) => setMedicalForm({ ...medicalForm, title: e.target.value })}
                          placeholder="e.g., Annual Check-up"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={medicalForm.description}
                          onChange={(e) => setMedicalForm({ ...medicalForm, description: e.target.value })}
                          placeholder="Brief description of the record"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="record_date">Record Date</Label>
                        <Input
                          id="record_date"
                          type="date"
                          value={medicalForm.record_date}
                          onChange={(e) => setMedicalForm({ ...medicalForm, record_date: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="file">File</Label>
                        <Input
                          id="file"
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={(e) => setMedicalFile(e.target.files?.[0] || null)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsUploadMedicalOpen(false)}>Cancel</Button>
                      <Button onClick={handleMedicalUpload} disabled={createMedicalRecord.isPending}>
                        {createMedicalRecord.isPending ? 'Uploading...' : 'Upload'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {medicalRecordsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : medicalRecords && medicalRecords.length > 0 ? (
                <div className="space-y-4">
                  {medicalRecords.map((record: any) => (
                    <div key={record.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{record.title}</h4>
                        <Badge variant={record.is_verified ? 'default' : 'secondary'}>
                          {record.is_verified ? 'Verified' : 'Pending'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{record.description}</p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Record Date: {new Date(record.record_date).toLocaleDateString()}</span>
                        <span>File: {record.file_type.toUpperCase()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No medical records uploaded yet</p>
                </div>
              )}
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
              Update your personal information and contact details.
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
              <Label>Emergency Contact Name</Label>
              <Input
                value={editForm.emergency_contact_name}
                onChange={(e) => setEditForm({ ...editForm, emergency_contact_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Emergency Contact Number</Label>
              <Input
                value={editForm.emergency_contact_number}
                onChange={(e) => setEditForm({ ...editForm, emergency_contact_number: e.target.value })}
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

export default StudentProfile;

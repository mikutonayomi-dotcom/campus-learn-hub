import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, Edit2, Trash2, Loader2, Users } from "lucide-react";
import { useOrganizations, useCreateOrganization, useUpdateOrganization, useDeleteOrganization, useFaculty } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

interface OrganizationData {
  id: number;
  name: string;
  description: string;
  category: string;
  adviser_id: number;
  is_active: boolean;
  adviser: { user: { name: string } };
  members_count?: number;
}

const Organizations = () => {
  const { data: organizations, isLoading } = useOrganizations();
  const { data: faculty } = useFaculty();
  const createOrganization = useCreateOrganization();
  const updateOrganization = useUpdateOrganization();
  const deleteOrganization = useDeleteOrganization();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationData | null>(null);

  const [newOrgForm, setNewOrgForm] = useState({
    name: "",
    description: "",
    adviser_id: "",
    category: "academic",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    adviser_id: "",
    category: "",
    is_active: true,
  });

  const resetForm = () => {
    setNewOrgForm({
      name: "",
      description: "",
      adviser_id: "",
      category: "academic",
    });
  };

  const handleCreateOrganization = async () => {
    try {
      await createOrganization.mutateAsync({
        name: newOrgForm.name,
        description: newOrgForm.description,
        adviser_id: parseInt(newOrgForm.adviser_id),
        category: newOrgForm.category,
      });
      toast({ title: "Organization created successfully" });
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error creating organization",
        description: error.response?.data?.message || error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (org: OrganizationData) => {
    setSelectedOrganization(org);
    setEditForm({
      name: org.name,
      description: org.description,
      adviser_id: org.adviser_id.toString(),
      category: org.category,
      is_active: org.is_active,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateOrganization = async () => {
    if (!selectedOrganization) return;

    try {
      await updateOrganization.mutateAsync({
        id: selectedOrganization.id,
        organization: {
          name: editForm.name,
          description: editForm.description,
          adviser_id: parseInt(editForm.adviser_id),
          category: editForm.category,
          is_active: editForm.is_active,
        },
      });
      toast({ title: "Organization updated successfully" });
      setIsEditModalOpen(false);
      setSelectedOrganization(null);
    } catch (error: any) {
      toast({
        title: "Error updating organization",
        description: error.response?.data?.message || error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOrganization = async (org: OrganizationData) => {
    if (!confirm(`Are you sure you want to delete ${org.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteOrganization.mutateAsync(org.id);
      toast({ title: "Organization deleted successfully" });
    } catch (error: any) {
      toast({
        title: "Error deleting organization",
        description: error.response?.data?.message || error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const filteredOrganizations = organizations?.filter(
    (org: OrganizationData) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Organizations</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage student organizations and assign faculty advisers</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Add Organization</DialogTitle>
              <DialogDescription>Create a new student organization</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name</Label>
                  <Input
                    id="name"
                    value={newOrgForm.name}
                    onChange={(e) => setNewOrgForm({ ...newOrgForm, name: e.target.value })}
                    placeholder="e.g., Computer Society"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newOrgForm.description}
                    onChange={(e) => setNewOrgForm({ ...newOrgForm, description: e.target.value })}
                    placeholder="Organization description"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newOrgForm.category}
                    onValueChange={(value) => setNewOrgForm({ ...newOrgForm, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="religious">Religious</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adviser">Faculty Adviser</Label>
                  <Select
                    value={newOrgForm.adviser_id}
                    onValueChange={(value) => setNewOrgForm({ ...newOrgForm, adviser_id: value })}
                  >
                    <SelectTrigger id="adviser">
                      <SelectValue placeholder="Select adviser" />
                    </SelectTrigger>
                    <SelectContent>
                      {faculty?.map((f: any) => (
                        <SelectItem key={f.id} value={f.id.toString()}>
                          {f.user?.name || "Unknown"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => { setIsCreateModalOpen(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleCreateOrganization} disabled={createOrganization.isPending}>
                {createOrganization.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Adding...</> : "Add Organization"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="border rounded-lg bg-card">
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Adviser</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrganizations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No organizations found</TableCell>
                </TableRow>
              ) : (
                filteredOrganizations.map((org: OrganizationData) => (
                  <TableRow key={org.id} className="transition-colors duration-150 hover:bg-muted/50">
                    <TableCell className="font-medium">{org.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{org.category}</Badge>
                    </TableCell>
                    <TableCell>{org.adviser?.user?.name || "Not assigned"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {org.members_count || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={org.is_active ? "default" : "secondary"} className="capitalize">
                        {org.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick(org)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteOrganization(org)}
                          disabled={deleteOrganization.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Organization</DialogTitle>
            <DialogDescription>Update organization information</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit_name">Organization Name</Label>
                <Input
                  id="edit_name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_description">Description</Label>
                <Textarea
                  id="edit_description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_category">Category</Label>
                <Select
                  value={editForm.category}
                  onValueChange={(value) => setEditForm({ ...editForm, category: value })}
                >
                  <SelectTrigger id="edit_category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="religious">Religious</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_adviser">Faculty Adviser</Label>
                <Select
                  value={editForm.adviser_id}
                  onValueChange={(value) => setEditForm({ ...editForm, adviser_id: value })}
                >
                  <SelectTrigger id="edit_adviser">
                    <SelectValue placeholder="Select adviser" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculty?.map((f: any) => (
                      <SelectItem key={f.id} value={f.id.toString()}>
                        {f.user?.name || "Unknown"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="edit_is_active">Active Status</Label>
                <Select
                  value={editForm.is_active ? "true" : "false"}
                  onValueChange={(value) => setEditForm({ ...editForm, is_active: value === "true" })}
                >
                  <SelectTrigger id="edit_is_active" className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => { setIsEditModalOpen(false); setSelectedOrganization(null); }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateOrganization} disabled={updateOrganization.isPending}>
              {updateOrganization.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Updating...</> : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Organizations;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, Plus, Edit2, Trash2, Users, 
  Loader2, MapPin
} from "lucide-react";
import { 
  useRooms, useCreateRoom, useUpdateRoom, useDeleteRoom
} from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

interface RoomData {
  id: number;
  code: string;
  name: string;
  type: string;
  capacity: number;
  location: string | null;
  is_active: boolean;
  schedules_count: number;
  created_at: string;
}

const Rooms = () => {
  const { data: rooms, isLoading } = useRooms();
  const createRoom = useCreateRoom();
  const updateRoom = useUpdateRoom();
  const deleteRoom = useDeleteRoom();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);

  const [newRoomForm, setNewRoomForm] = useState({
    code: "",
    name: "",
    type: "classroom",
    capacity: "45",
    location: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    type: "",
    capacity: "",
    location: "",
    is_active: true,
  });

  const resetForm = () => {
    setNewRoomForm({
      code: "",
      name: "",
      type: "classroom",
      capacity: "45",
      location: "",
    });
  };

  const handleCreateRoom = async () => {
    try {
      await createRoom.mutateAsync({
        code: newRoomForm.code,
        name: newRoomForm.name,
        type: newRoomForm.type,
        capacity: parseInt(newRoomForm.capacity),
        location: newRoomForm.location || null,
      });
      toast({ title: "Room created successfully" });
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ 
        title: "Error creating room", 
        description: error.response?.data?.message || error.message || "Something went wrong",
        variant: "destructive" 
      });
    }
  };

  const handleEditClick = (room: RoomData) => {
    setSelectedRoom(room);
    setEditForm({
      name: room.name,
      type: room.type,
      capacity: room.capacity.toString(),
      location: room.location || "",
      is_active: room.is_active,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateRoom = async () => {
    if (!selectedRoom) return;
    
    try {
      await updateRoom.mutateAsync({
        id: selectedRoom.id,
        room: {
          name: editForm.name,
          type: editForm.type,
          capacity: parseInt(editForm.capacity),
          location: editForm.location || null,
          is_active: editForm.is_active,
        }
      });
      toast({ title: "Room updated successfully" });
      setIsEditModalOpen(false);
      setSelectedRoom(null);
    } catch (error: any) {
      toast({ 
        title: "Error updating room", 
        description: error.response?.data?.message || error.message || "Something went wrong",
        variant: "destructive" 
      });
    }
  };

  const handleDeleteRoom = async (room: RoomData) => {
    if (!confirm(`Are you sure you want to delete ${room.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteRoom.mutateAsync(room.id);
      toast({ title: "Room deleted successfully" });
    } catch (error: any) {
      toast({ 
        title: "Error deleting room", 
        description: error.response?.data?.message || error.message || "Something went wrong",
        variant: "destructive" 
      });
    }
  };

  const filteredRooms = rooms?.filter((room: RoomData) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Facilities Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage rooms and facilities</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
              <DialogDescription>Create a new room or facility</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="room_code">Room Code</Label>
                  <Input
                    id="room_code"
                    value={newRoomForm.code}
                    onChange={(e) => setNewRoomForm({ ...newRoomForm, code: e.target.value })}
                    placeholder="e.g., CL101"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="room_name">Room Name</Label>
                  <Input
                    id="room_name"
                    value={newRoomForm.name}
                    onChange={(e) => setNewRoomForm({ ...newRoomForm, name: e.target.value })}
                    placeholder="e.g., Computer Lab 101"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="room_type">Room Type</Label>
                  <Select 
                    value={newRoomForm.type} 
                    onValueChange={(value) => setNewRoomForm({ ...newRoomForm, type: value })}
                  >
                    <SelectTrigger id="room_type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classroom">Classroom</SelectItem>
                      <SelectItem value="laboratory">Laboratory</SelectItem>
                      <SelectItem value="auditorium">Auditorium</SelectItem>
                      <SelectItem value="gym">Gym</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min="1"
                      max="500"
                      value={newRoomForm.capacity}
                      onChange={(e) => setNewRoomForm({ ...newRoomForm, capacity: e.target.value })}
                      placeholder="45"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newRoomForm.location}
                      onChange={(e) => setNewRoomForm({ ...newRoomForm, location: e.target.value })}
                      placeholder="e.g., 1st Floor"
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => { setIsCreateModalOpen(false); resetForm(); }}>Cancel</Button>
              <Button onClick={handleCreateRoom} disabled={createRoom.isPending}>
                {createRoom.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating...</> : "Add Room"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rooms..."
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
                <TableHead>Room Code</TableHead>
                <TableHead>Room Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Schedules</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRooms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No rooms found</TableCell>
                </TableRow>
              ) : (
                filteredRooms.map((room: RoomData) => (
                  <TableRow key={room.id} className="transition-colors duration-150 hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">{room.code}</TableCell>
                    <TableCell className="font-medium">{room.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {room.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {room.capacity}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {room.location || "-"}
                      </div>
                    </TableCell>
                    <TableCell>{room.schedules_count || 0}</TableCell>
                    <TableCell>
                      <Badge variant={room.is_active ? "default" : "secondary"} className="capitalize">
                        {room.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleEditClick(room)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteRoom(room)}
                          disabled={deleteRoom.isPending}
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
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>Update the room information</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit_room_code">Room Code</Label>
                <Input
                  id="edit_room_code"
                  value={selectedRoom?.code || ""}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_room_name">Room Name</Label>
                <Input
                  id="edit_room_name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="e.g., Computer Lab 101"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_room_type">Room Type</Label>
                <Select 
                  value={editForm.type} 
                  onValueChange={(value) => setEditForm({ ...editForm, type: value })}
                >
                  <SelectTrigger id="edit_room_type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classroom">Classroom</SelectItem>
                    <SelectItem value="laboratory">Laboratory</SelectItem>
                    <SelectItem value="auditorium">Auditorium</SelectItem>
                    <SelectItem value="gym">Gym</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_capacity">Capacity</Label>
                  <Input
                    id="edit_capacity"
                    type="number"
                    min="1"
                    max="500"
                    value={editForm.capacity}
                    onChange={(e) => setEditForm({ ...editForm, capacity: e.target.value })}
                    placeholder="45"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_location">Location</Label>
                  <Input
                    id="edit_location"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    placeholder="e.g., 1st Floor"
                  />
                </div>
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
            <Button variant="outline" onClick={() => { setIsEditModalOpen(false); setSelectedRoom(null); }}>Cancel</Button>
            <Button onClick={handleUpdateRoom} disabled={updateRoom.isPending}>
              {updateRoom.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Updating...</> : "Update Room"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rooms;

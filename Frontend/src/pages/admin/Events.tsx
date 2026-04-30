import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Check, X, Loader2, Calendar, Plus, Clock, MapPin, Users } from "lucide-react";
import { useEvents, useApproveEvent, useRejectEvent, useCreateEvent } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

interface EventData {
  id: number;
  title: string;
  description: string;
  type: string;
  start_date: string;
  end_date: string;
  venue: string | null;
  status: string;
  admin_remarks: string | null;
  organizer: { user?: { name: string }; name?: string; first_name?: string; last_name?: string };
}

const Events = () => {
  const { data: events, isLoading } = useEvents();
  const approveEvent = useApproveEvent();
  const rejectEvent = useRejectEvent();
  const createEvent = useCreateEvent();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const [searchTerm, setSearchTerm] = useState("");
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [adminRemarks, setAdminRemarks] = useState("");
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    type: 'academic',
    start_date: '',
    end_date: '',
    venue: ''
  });

  const handleApprove = async () => {
    if (!selectedEvent) return;
    try {
      await approveEvent.mutateAsync({
        id: selectedEvent.id,
        remarks: adminRemarks || undefined,
      });
      toast({ title: "Event approved successfully" });
      setIsApproveModalOpen(false);
      setSelectedEvent(null);
      setAdminRemarks("");
    } catch (error: any) {
      toast({
        title: "Error approving event",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    if (!selectedEvent) return;
    if (!adminRemarks.trim()) {
      toast({ title: "Remarks required for rejection", variant: "destructive" });
      return;
    }
    try {
      await rejectEvent.mutateAsync({
        id: selectedEvent.id,
        remarks: adminRemarks,
      });
      toast({ title: "Event rejected successfully" });
      setIsRejectModalOpen(false);
      setSelectedEvent(null);
      setAdminRemarks("");
    } catch (error: any) {
      toast({
        title: "Error rejecting event",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    }
  };

  const handleCreateEvent = async () => {
    if (!eventForm.title || !eventForm.description || !eventForm.start_date || !eventForm.end_date) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    const startDate = new Date(eventForm.start_date);
    if (startDate < new Date()) {
      toast({ title: "Event date cannot be in the past", variant: "destructive" });
      return;
    }
    try {
      await createEvent.mutateAsync(eventForm);
      toast({ title: "Event created successfully" });
      setIsCreateModalOpen(false);
      setEventForm({
        title: '',
        description: '',
        type: 'academic',
        start_date: '',
        end_date: '',
        venue: ''
      });
    } catch (error: any) {
      toast({
        title: "Error creating event",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    }
  };

  const filteredEvents = events?.filter(
    (e: EventData) =>
      (statusFilter === 'all' || e.status === statusFilter) &&
      (e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       e.type.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  // Group events by month for calendar-inspired view
  const groupedEvents = filteredEvents.reduce((acc: Record<string, EventData[]>, event: EventData) => {
    const date = new Date(event.start_date);
    const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(event);
    return acc;
  }, {} as Record<string, EventData[]>);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'academic':
        return <Badge variant="default">Academic</Badge>;
      case 'extra_curricular':
        return <Badge variant="secondary">Extracurricular</Badge>;
      case 'sports':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Sports</Badge>;
      case 'cultural':
        return <Badge className="bg-purple-500 hover:bg-purple-600">Cultural</Badge>;
      default:
        return <Badge variant="outline">{type || 'Other'}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Events</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage all campus events</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
            <Button
              key={filter}
              variant={statusFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : Object.keys(groupedEvents).length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try a different search term' : 'No events scheduled at this time'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {(Object.entries(groupedEvents) as [string, EventData[]][])
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([month, monthEvents]) => (
              <div key={month} className="space-y-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold">{month}</h2>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="grid gap-4">
                  {monthEvents
                    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
                    .map((event: EventData) => (
                      <Card key={event.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-lg flex flex-col items-center justify-center">
                              <span className="text-2xl font-bold text-primary">
                                {new Date(event.start_date).getDate()}
                              </span>
                              <span className="text-xs text-primary">
                                {new Date(event.start_date).toLocaleDateString('en-US', { month: 'short' })}
                              </span>
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg">{event.title}</h3>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {event.description}
                                  </p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                  {getStatusBadge(event.status)}
                                  {getTypeBadge(event.type)}
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {event.venue || 'TBD'}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {event.organizer?.user?.name || event.organizer?.name || `${event.organizer?.first_name || ''} ${event.organizer?.last_name || ''}`.trim() || 'Unknown'}
                                </div>
                              </div>
                              {event.admin_remarks && (
                                <div className="text-sm text-muted-foreground">
                                  <span className="font-medium">Remarks:</span> {event.admin_remarks}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-2 flex-shrink-0">
                              {event.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => {
                                      setSelectedEvent(event);
                                      setAdminRemarks("");
                                      setIsApproveModalOpen(true);
                                    }}
                                    disabled={approveEvent.isPending}
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                      setSelectedEvent(event);
                                      setAdminRemarks("");
                                      setIsRejectModalOpen(true);
                                    }}
                                    disabled={rejectEvent.isPending}
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedEvent(event);
                                  setEventForm({
                                    title: event.title,
                                    description: event.description,
                                    type: event.type,
                                    start_date: event.start_date,
                                    end_date: event.end_date,
                                    venue: event.venue || ''
                                  });
                                  setIsCreateModalOpen(true);
                                }}
                              >
                                Edit
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Approve Modal */}
      <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Event</DialogTitle>
            <DialogDescription>Confirm approval of this event proposal</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium">{selectedEvent?.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{selectedEvent?.description}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {selectedEvent?.start_date && new Date(selectedEvent.start_date).toLocaleDateString()} - {selectedEvent?.venue || "TBD"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Organizer: {selectedEvent?.organizer?.user?.name || selectedEvent?.organizer?.name || `${selectedEvent?.organizer?.first_name || ''} ${selectedEvent?.organizer?.last_name || ''}`.trim() || 'Unknown'}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin_remarks">Admin Remarks (Optional)</Label>
              <Textarea
                id="admin_remarks"
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
                placeholder="Add any additional notes..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsApproveModalOpen(false); setSelectedEvent(null); }}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={approveEvent.isPending}>
              {approveEvent.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Approving...</> : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Event</DialogTitle>
            <DialogDescription>Provide reason for rejecting this event proposal</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium">{selectedEvent?.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{selectedEvent?.description}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {selectedEvent?.start_date && new Date(selectedEvent.start_date).toLocaleDateString()} - {selectedEvent?.venue || "TBD"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Organizer: {selectedEvent?.organizer?.user?.name || selectedEvent?.organizer?.name || `${selectedEvent?.organizer?.first_name || ''} ${selectedEvent?.organizer?.last_name || ''}`.trim() || 'Unknown'}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reject_remarks">Rejection Reason *</Label>
              <Textarea
                id="reject_remarks"
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
                placeholder="Explain why this event is being rejected..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsRejectModalOpen(false); setSelectedEvent(null); }}>
              Cancel
            </Button>
            <Button onClick={handleReject} disabled={rejectEvent.isPending} variant="destructive">
              {rejectEvent.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Rejecting...</> : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Event Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>Create a new event for the campus</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                placeholder="Event title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                placeholder="Full event description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Event Type</Label>
              <Select value={eventForm.type} onValueChange={(value) => setEventForm({ ...eventForm, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="extra_curricular">Extracurricular</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  type="datetime-local"
                  value={eventForm.start_date}
                  onChange={(e) => setEventForm({ ...eventForm, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date *</Label>
                <Input
                  id="end_date"
                  type="datetime-local"
                  value={eventForm.end_date}
                  onChange={(e) => setEventForm({ ...eventForm, end_date: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                value={eventForm.venue}
                onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                placeholder="Event location"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateEvent} disabled={createEvent.isPending}>
              {createEvent.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating...</> : "Create Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Events;

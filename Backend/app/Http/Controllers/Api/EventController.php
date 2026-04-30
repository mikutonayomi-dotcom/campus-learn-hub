<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::with(['organizer', 'approver', 'participants.user']);

        // Role-based visibility
        if ($request->user()->isStudent()) {
            // Students only see approved events
            $query->where('status', 'approved');
        } elseif ($request->user()->isFaculty()) {
            // Faculty see their own events and approved events
            $faculty = $request->user()->faculty;
            if ($faculty) {
                $query->where(function ($q) use ($faculty) {
                    $q->where('organized_by', $faculty->id)
                      ->orWhere('status', 'approved');
                });
            }
        }
        // Admin sees all events (no filtering)

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('organized_by')) {
            $query->where('organized_by', $request->organized_by);
        }

        if ($request->has('upcoming')) {
            $query->where('start_date', '>=', now());
        }

        if ($request->has('my_events') && $request->user()->isFaculty()) {
            $faculty = $request->user()->faculty;
            if ($faculty) {
                $query->where('organized_by', $faculty->id);
            }
        }

        return response()->json($query->orderBy('start_date', 'asc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'type' => 'required|in:academic,extra_curricular,sports,cultural,other',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'venue' => 'nullable|string',
        ]);

        $organizerId = null;
        $organizerType = null;

        if ($request->user()->isAdmin()) {
            // Admin can create events, organized_by references user_id
            $organizerId = $request->user()->id;
            $organizerType = 'admin';
        } elseif ($request->user()->isFaculty()) {
            $faculty = $request->user()->faculty;
            if (!$faculty) {
                return response()->json(['message' => 'Faculty profile not found'], 404);
            }
            $organizerId = $faculty->id;
            $organizerType = 'faculty';
        } else {
            return response()->json(['message' => 'Unauthorized to create events'], 403);
        }

        $event = Event::create([
            ...$validated,
            'organized_by' => $organizerId,
            'organizer_type' => $organizerType,
            'status' => 'approved',
        ]);

        return response()->json($event->load(['organizer']), 201);
    }

    public function show(Event $event)
    {
        return response()->json($event->load(['organizer', 'approver', 'participants.user']));
    }

    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string',
            'description' => 'sometimes|string',
            'type' => 'sometimes|in:academic,extra_curricular,sports,cultural,other',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'venue' => 'nullable|string',
        ]);

        $event->update($validated);
        return response()->json($event->load(['organizer', 'participants.user']));
    }

    public function destroy(Event $event)
    {
        $event->delete();
        return response()->json(['message' => 'Event deleted successfully']);
    }

    public function submitForApproval(Event $event)
    {
        if ($event->status !== 'draft') {
            return response()->json(['message' => 'Event is not in draft status'], 422);
        }

        $event->update(['status' => 'pending']);
        return response()->json($event->load(['organizer']));
    }

    public function approve(Request $request, Event $event)
    {
        $validated = $request->validate([
            'admin_remarks' => 'nullable|string',
        ]);

        $event->update([
            'status' => 'approved',
            'admin_remarks' => $validated['admin_remarks'] ?? null,
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        return response()->json($event->load(['organizer', 'approver']));
    }

    public function reject(Request $request, Event $event)
    {
        $validated = $request->validate([
            'admin_remarks' => 'required|string',
        ]);

        $event->update([
            'status' => 'rejected',
            'admin_remarks' => $validated['admin_remarks'],
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        return response()->json($event->load(['organizer', 'approver']));
    }

    public function join(Event $event, Request $request)
    {
        $student = $request->user()->student;
        if (!$student) {
            return response()->json(['message' => 'Student profile not found'], 404);
        }

        if ($event->participants()->where('student_id', $student->id)->exists()) {
            return response()->json(['message' => 'Already registered for this event'], 422);
        }

        $event->participants()->attach($student->id, [
            'status' => 'registered',
            'remarks' => null,
        ]);

        return response()->json(['message' => 'Successfully registered for event']);
    }

    public function markAttendance(Request $request, Event $event)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'status' => 'required|in:attended,absent',
            'remarks' => 'nullable|string',
        ]);

        $event->participants()->updateExistingPivot($validated['student_id'], [
            'status' => $validated['status'],
            'remarks' => $validated['remarks'] ?? null,
        ]);

        return response()->json(['message' => 'Attendance marked successfully']);
    }

    public function pendingCount()
    {
        $count = Event::where('status', 'pending')->count();
        return response()->json(['count' => $count]);
    }

    public function upcomingEvents()
    {
        $events = Event::with(['organizer'])
            ->where('status', 'approved')
            ->where('start_date', '>=', now())
            ->orderBy('start_date', 'asc')
            ->get();

        return response()->json($events);
    }
}

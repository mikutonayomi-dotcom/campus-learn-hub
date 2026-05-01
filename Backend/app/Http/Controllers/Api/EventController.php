<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::with(['participants.user']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->orderBy('date', 'asc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'date' => 'required|date',
            'time' => 'nullable|time',
            'location' => 'nullable|string',
        ]);

        $event = Event::create([
            ...$validated,
            'status' => 'approved',
        ]);

        return response()->json($event, 201);
    }

    public function show(Event $event)
    {
        return response()->json($event->load(['participants.user']));
    }

    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string',
            'description' => 'sometimes|string',
            'date' => 'sometimes|date',
            'time' => 'nullable|time',
            'location' => 'nullable|string',
        ]);

        $event->update($validated);
        return response()->json($event->load(['participants.user']));
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
        return response()->json($event);
    }

    public function approve(Request $request, Event $event)
    {
        $event->update(['status' => 'approved']);
        return response()->json($event);
    }

    public function reject(Request $request, Event $event)
    {
        $event->update(['status' => 'rejected']);
        return response()->json($event);
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
        $events = Event::with(['participants.user'])
            ->where('status', 'approved')
            ->where('date', '>=', now())
            ->orderBy('date', 'asc')
            ->get();

        return response()->json($events);
    }
}

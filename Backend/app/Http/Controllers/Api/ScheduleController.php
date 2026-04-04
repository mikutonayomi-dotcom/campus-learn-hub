<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        $query = Schedule::with(['subject', 'faculty.user', 'section', 'room']);

        if ($request->has('faculty_id')) {
            $query->where('faculty_id', $request->faculty_id);
        }

        if ($request->has('section_id')) {
            $query->where('section_id', $request->section_id);
        }

        if ($request->has('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }

        if ($request->has('room_id')) {
            $query->where('room_id', $request->room_id);
        }

        if ($request->has('day')) {
            $query->where('day', $request->day);
        }

        if ($request->has('academic_year')) {
            $query->where('academic_year', $request->academic_year);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'faculty_id' => 'required|exists:faculty,id',
            'section_id' => 'required|exists:sections,id',
            'room_id' => 'required|exists:rooms,id',
            'day' => 'required|in:monday,tuesday,wednesday,thursday,friday,saturday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'academic_year' => 'required|string',
            'semester' => 'required|integer|min:1|max:2',
        ]);

        // Check for conflicts
        $conflict = Schedule::where('room_id', $validated['room_id'])
            ->where('day', $validated['day'])
            ->where('academic_year', $validated['academic_year'])
            ->where(function ($query) use ($validated) {
                $query->whereBetween('start_time', [$validated['start_time'], $validated['end_time']])
                    ->orWhereBetween('end_time', [$validated['start_time'], $validated['end_time']])
                    ->orWhere(function ($q) use ($validated) {
                        $q->where('start_time', '<=', $validated['start_time'])
                          ->where('end_time', '>=', $validated['end_time']);
                    });
            })
            ->exists();

        if ($conflict) {
            return response()->json(['message' => 'Schedule conflict detected'], 422);
        }

        $schedule = Schedule::create($validated);
        return response()->json($schedule->load(['subject', 'faculty.user', 'section', 'room']), 201);
    }

    public function show(Schedule $schedule)
    {
        return response()->json($schedule->load(['subject', 'faculty.user', 'section', 'room', 'attendance.student.user']));
    }

    public function update(Request $request, Schedule $schedule)
    {
        $validated = $request->validate([
            'subject_id' => 'sometimes|exists:subjects,id',
            'faculty_id' => 'sometimes|exists:faculty,id',
            'section_id' => 'sometimes|exists:sections,id',
            'room_id' => 'sometimes|exists:rooms,id',
            'day' => 'sometimes|in:monday,tuesday,wednesday,thursday,friday,saturday',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i|after:start_time',
            'academic_year' => 'sometimes|string',
            'semester' => 'sometimes|integer|min:1|max:2',
        ]);

        $schedule->update($validated);
        return response()->json($schedule->load(['subject', 'faculty.user', 'section', 'room']));
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->delete();
        return response()->json(['message' => 'Schedule deleted successfully']);
    }

    public function mySchedule(Request $request)
    {
        if ($request->user()->isFaculty()) {
            $schedules = Schedule::with(['subject', 'section', 'room', 'attendance'])
                ->where('faculty_id', $request->user()->faculty->id)
                ->get();
        } else {
            $student = $request->user()->student;
            $sectionIds = Section::where('name', $student->section)
                ->where('course_id', $student->course_id)
                ->pluck('id');
            
            $schedules = Schedule::with(['subject', 'faculty.user', 'room'])
                ->whereIn('section_id', $sectionIds)
                ->get();
        }

        return response()->json($schedules);
    }
}

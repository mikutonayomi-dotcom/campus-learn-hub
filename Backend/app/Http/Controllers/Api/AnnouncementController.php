<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        $query = Announcement::with(['author', 'course', 'section', 'subject']);

        // Filter by subject_id if provided
        if ($request->has('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }

        // Filter by target audience based on user role
        if ($request->user()->isStudent()) {
            $student = $request->user()->student;
            $query->where(function ($q) use ($student) {
                $q->where('course_id', $student->course_id)
                  ->orWhere('section_id', $student->section_id)
                  ->orWhereNull('course_id')
                  ->orWhereNull('section_id');
            });
        } elseif ($request->user()->isFaculty()) {
            // Faculty see all announcements
            $query->where(function ($q) {
                $q->whereNull('course_id')
                  ->orWhereNull('section_id');
            });
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'subject_id' => 'nullable|exists:subjects,id',
            'course_id' => 'nullable|exists:courses,id',
            'section_id' => 'nullable|exists:sections,id',
        ]);

        $validated['author_id'] = $request->user()->id;

        $announcement = Announcement::create($validated);

        return response()->json($announcement->load(['author', 'course', 'section', 'subject']), 201);
    }

    public function show(Announcement $announcement)
    {
        return response()->json($announcement->load('author'));
    }

    public function update(Request $request, Announcement $announcement)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'subject_id' => 'nullable|exists:subjects,id',
            'course_id' => 'nullable|exists:courses,id',
            'section_id' => 'nullable|exists:sections,id',
        ]);

        $announcement->update($validated);

        return response()->json($announcement->load('author'));
    }

    public function destroy(Announcement $announcement)
    {
        $announcement->delete();
        return response()->json(['message' => 'Announcement deleted successfully']);
    }
}

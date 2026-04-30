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
                $q->where('target_audience', 'all')
                  ->orWhere('target_audience', 'students')
                  ->orWhere('course_id', $student->course_id)
                  ->orWhere('section_id', $student->section_id);
            });
        } elseif ($request->user()->isFaculty()) {
            $query->where(function ($q) {
                $q->where('target_audience', 'all')
                  ->orWhere('target_audience', 'faculty');
            });
        } elseif ($request->user()->isAdmin()) {
            $query->where(function ($q) {
                $q->where('target_audience', 'all')
                  ->orWhere('target_audience', 'admin');
            });
        }

        // Only show published announcements
        $query->where('is_published', true);

        // Filter out expired announcements
        $query->where(function ($q) {
            $q->whereNull('expires_at')
              ->orWhere('expires_at', '>', now());
        });

        // Order by priority and published date
        $query->orderByRaw("FIELD(priority, 'high', 'medium', 'low')")
              ->orderBy('published_at', 'desc');

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'subject_id' => 'nullable|exists:subjects,id',
            'course_id' => 'nullable|exists:courses,id',
            'section_id' => 'nullable|exists:sections,id',
            'target_audience' => 'required|in:all,students,faculty,admin',
            'priority' => 'required|in:low,medium,high',
            'is_published' => 'sometimes|boolean',
            'published_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after_or_equal:published_at',
        ]);

        $validated['author_id'] = $request->user()->id;
        $validated['is_published'] = $validated['is_published'] ?? true;
        $validated['published_at'] = $validated['published_at'] ?? now();

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
            'target_audience' => 'sometimes|in:all,students,faculty,admin',
            'priority' => 'sometimes|in:low,medium,high',
            'is_published' => 'sometimes|boolean',
            'published_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:published_at',
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

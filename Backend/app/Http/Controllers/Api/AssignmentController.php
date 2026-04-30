<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use Illuminate\Http\Request;

class AssignmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Assignment::with(['subject', 'faculty.user', 'section']);

        if ($request->has('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }

        if ($request->has('section_id')) {
            $query->where('section_id', $request->section_id);
        }

        if ($request->has('faculty_id')) {
            $query->where('faculty_id', $request->faculty_id);
        }

        if ($request->has('is_published')) {
            $query->where('is_published', $request->boolean('is_published'));
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'subject_id' => 'required|exists:subjects,id',
                'section_id' => 'nullable|exists:sections,id',
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'instructions' => 'nullable|string',
                'deadline' => 'nullable|date',
                'max_points' => 'nullable|integer|min:0',
                'is_published' => 'sometimes|boolean',
            ]);

            $validated['faculty_id'] = $request->user()->faculty->id;
            $validated['is_published'] = $validated['is_published'] ?? true;
            $validated['max_points'] = $validated['max_points'] ?? 100;

            $assignment = Assignment::create($validated);

            return response()->json($assignment->load(['subject', 'faculty.user', 'section']), 201);
        } catch (\Exception $e) {
            \Log::error('Assignment store error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create assignment: ' . $e->getMessage()], 500);
        }
    }

    public function show(Assignment $assignment)
    {
        return response()->json($assignment->load(['subject', 'faculty.user', 'section', 'submissions.student.user']));
    }

    public function update(Request $request, Assignment $assignment)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'instructions' => 'nullable|string',
            'deadline' => 'nullable|date',
            'max_points' => 'nullable|integer|min:0',
            'is_published' => 'sometimes|boolean',
        ]);

        $assignment->update($validated);

        return response()->json($assignment->load(['subject', 'faculty.user', 'section']));
    }

    public function destroy(Assignment $assignment)
    {
        $assignment->delete();
        return response()->json(['message' => 'Assignment deleted successfully']);
    }
}

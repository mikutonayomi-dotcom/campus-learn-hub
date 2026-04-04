<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use Illuminate\Http\Request;

class SubmissionController extends Controller
{
    public function index(Request $request)
    {
        $query = Submission::with(['student.user', 'material.subject', 'grader.user']);

        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->has('material_id')) {
            $query->where('material_id', $request->material_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('graded_by')) {
            $query->where('graded_by', $request->graded_by);
        }

        if ($request->has('my_submissions') && $request->user()->isStudent()) {
            $query->where('student_id', $request->user()->student->id);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'material_id' => 'required|exists:materials,id',
            'content' => 'nullable|string',
            'file_path' => 'nullable|string',
            'external_link' => 'nullable|url',
        ]);

        $material = \App\Models\Material::findOrFail($validated['material_id']);

        // Check if already submitted
        $existing = Submission::where('student_id', $request->user()->student->id)
            ->where('material_id', $validated['material_id'])
            ->first();

        if ($existing) {
            $existing->update([
                ...$validated,
                'status' => 'resubmitted',
                'submitted_at' => now(),
            ]);
            return response()->json($existing->load(['material.subject', 'student.user']), 200);
        }

        $submission = Submission::create([
            ...$validated,
            'student_id' => $request->user()->student->id,
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);

        return response()->json($submission->load(['material.subject', 'student.user']), 201);
    }

    public function show(Submission $submission)
    {
        return response()->json($submission->load(['student.user', 'material.subject', 'grader.user']));
    }

    public function update(Request $request, Submission $submission)
    {
        // Students can only update their own submissions if not graded
        if ($request->user()->isStudent() && $submission->status === 'graded') {
            return response()->json(['message' => 'Cannot edit graded submission'], 403);
        }

        $validated = $request->validate([
            'content' => 'nullable|string',
            'file_path' => 'nullable|string',
            'external_link' => 'nullable|url',
        ]);

        $submission->update([
            ...$validated,
            'status' => 'resubmitted',
            'submitted_at' => now(),
        ]);

        return response()->json($submission->load(['student.user', 'material.subject']));
    }

    public function grade(Request $request, Submission $submission)
    {
        $validated = $request->validate([
            'grade' => 'required|numeric|min:0|max:100',
            'feedback' => 'nullable|string',
        ]);

        $submission->update([
            'grade' => $validated['grade'],
            'feedback' => $validated['feedback'] ?? null,
            'graded_by' => $request->user()->faculty->id,
            'graded_at' => now(),
            'status' => 'graded',
        ]);

        return response()->json($submission->load(['student.user', 'material.subject', 'grader.user']));
    }

    public function destroy(Submission $submission)
    {
        if ($submission->status === 'graded') {
            return response()->json(['message' => 'Cannot delete graded submission'], 403);
        }

        $submission->delete();
        return response()->json(['message' => 'Submission deleted successfully']);
    }

    public function mySubmissions(Request $request)
    {
        $submissions = Submission::with(['material.subject', 'grader.user'])
            ->where('student_id', $request->user()->student->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($submissions);
    }

    public function submissionsToGrade(Request $request)
    {
        $facultyId = $request->user()->faculty->id;
        $materialIds = \App\Models\Material::where('uploaded_by', $facultyId)->pluck('id');

        $submissions = Submission::with(['student.user', 'material.subject'])
            ->whereIn('material_id', $materialIds)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($submissions);
    }
}

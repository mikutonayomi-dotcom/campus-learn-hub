<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use Illuminate\Http\Request;

class SubmissionController extends Controller
{
    public function index(Request $request)
    {
        $query = Submission::with(['student.user', 'assignment.subject', 'material.subject', 'grader.user']);

        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->has('assignment_id')) {
            $query->where('assignment_id', $request->assignment_id);
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
            $student = $request->user()->student;
            if ($student) {
                $query->where('student_id', $student->id);
            }
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'assignment_id' => 'nullable|exists:assignments,id',
            'material_id' => 'nullable|exists:materials,id',
            'subject_id' => 'nullable|exists:subjects,id',
            'title' => 'nullable|string',
            'content' => 'nullable|string',
            'description' => 'nullable|string',
            'file_path' => 'nullable|string',
            'external_link' => 'nullable|url',
        ]);

        $student = $request->user()->student;
        if (!$student) {
            return response()->json(['message' => 'Student profile not found'], 404);
        }

        // Handle file upload if present
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            
            // Validate file is valid
            if (!$file->isValid()) {
                return response()->json(['error' => 'File upload failed'], 400);
            }
            
            $path = $file->store('submissions', 'public');
            $validated['file_path'] = $path;
            $validated['original_filename'] = $file->getClientOriginalName();
        }

        // Use assignment_id if provided, otherwise use material_id for backward compatibility
        $assignmentId = $validated['assignment_id'] ?? null;
        $materialId = $validated['material_id'] ?? null;
        
        if ($assignmentId) {
            $assignment = \App\Models\Assignment::findOrFail($assignmentId);

            // Check if already submitted
            $existing = Submission::where('student_id', $student->id)
                ->where('assignment_id', $assignmentId)
                ->first();

            if ($existing) {
                $existing->update([
                    ...$validated,
                    'status' => 'resubmitted',
                    'submitted_at' => now(),
                ]);
                return response()->json($existing->load(['assignment.subject', 'student.user']), 200);
            }
        } elseif ($materialId) {
            $material = \App\Models\Material::findOrFail($materialId);

            // Check if already submitted
            $existing = Submission::where('student_id', $student->id)
                ->where('material_id', $materialId)
                ->first();

            if ($existing) {
                $existing->update([
                    ...$validated,
                    'status' => 'resubmitted',
                    'submitted_at' => now(),
                ]);
                return response()->json($existing->load(['material.subject', 'student.user']), 200);
            }
        }

        $submission = Submission::create([
            ...$validated,
            'student_id' => $student->id,
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);

        return response()->json($submission->load(['assignment.subject', 'material.subject', 'student.user']), 201);
    }

    public function show(Submission $submission)
    {
        return response()->json($submission->load(['student.user', 'assignment.subject', 'material.subject', 'grader.user']));
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

        return response()->json($submission->load(['student.user', 'assignment.subject', 'material.subject']));
    }

    public function grade(Request $request, Submission $submission)
    {
        $validated = $request->validate([
            'grade' => 'required|numeric|min:0|max:100',
            'feedback' => 'nullable|string',
        ]);

        $faculty = $request->user()->faculty;
        if (!$faculty) {
            return response()->json(['message' => 'Faculty profile not found'], 404);
        }

        $submission->update([
            'grade' => $validated['grade'],
            'feedback' => $validated['feedback'] ?? null,
            'graded_by' => $faculty->id,
            'graded_at' => now(),
            'status' => 'graded',
        ]);

        return response()->json($submission->load(['student.user', 'assignment.subject', 'material.subject', 'grader.user']));
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
        $student = $request->user()->student;
        
        if (!$student) {
            return response()->json([]);
        }
        
        $submissions = Submission::with(['assignment.subject', 'material.subject', 'grader.user'])
            ->where('student_id', $student->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($submissions);
    }

    public function submissionsToGrade(Request $request)
    {
        $faculty = $request->user()->faculty;
        if (!$faculty) {
            return response()->json([]);
        }
        
        // Get subjects taught by this faculty
        $subjectIds = \App\Models\Subject::where('faculty_id', $faculty->id)->pluck('id');
        
        $submissions = Submission::with(['student.user', 'assignment.subject', 'material.subject'])
            ->where(function($query) use ($subjectIds) {
                $query->whereHas('assignment', function($q) use ($subjectIds) {
                    $q->whereIn('subject_id', $subjectIds);
                })->orWhereHas('material', function($q) use ($subjectIds) {
                    $q->whereIn('subject_id', $subjectIds);
                });
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($submissions);
    }
}

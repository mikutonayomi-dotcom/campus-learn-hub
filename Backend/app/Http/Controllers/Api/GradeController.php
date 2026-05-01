<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use Illuminate\Http\Request;

class GradeController extends Controller
{
    public function index(Request $request)
    {
        $query = Grade::with(['student.user', 'subject']);

        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->has('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'subject_id' => 'required|exists:subjects,id',
            'midterm_grade' => 'nullable|numeric|min:0|max:100',
            'final_grade' => 'nullable|numeric|min:0|max:100',
            'remarks' => 'nullable|string',
        ]);

        // Calculate overall grade
        $overallGrade = null;
        if (isset($validated['midterm_grade']) && isset($validated['final_grade'])) {
            $overallGrade = ($validated['midterm_grade'] + $validated['final_grade']) / 2;
        }

        $grade = Grade::create([
            ...$validated,
            'overall_grade' => $overallGrade,
        ]);

        return response()->json($grade->load(['student.user', 'subject']), 201);
    }

    public function show(Grade $grade)
    {
        return response()->json($grade->load(['student.user', 'subject']));
    }

    public function update(Request $request, Grade $grade)
    {
        $validated = $request->validate([
            'midterm_grade' => 'nullable|numeric|min:0|max:100',
            'final_grade' => 'nullable|numeric|min:0|max:100',
            'remarks' => 'nullable|string',
        ]);

        // Recalculate overall grade
        $midterm = $validated['midterm_grade'] ?? $grade->midterm_grade;
        $final = $validated['final_grade'] ?? $grade->final_grade;
        $overallGrade = null;
        if ($midterm !== null && $final !== null) {
            $overallGrade = ($midterm + $final) / 2;
        }

        $grade->update([
            ...$validated,
            'overall_grade' => $overallGrade,
        ]);

        return response()->json($grade->load(['student.user', 'subject']));
    }

    public function lock(Request $request, Grade $grade)
    {
        // Only admin can lock grades
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized to lock this grade'], 403);
        }

        return response()->json(['message' => 'Grade locking not supported in current schema']);
    }

    public function myGrades(Request $request)
    {
        $student = $request->user()->student;
        if (!$student) {
            return response()->json([]);
        }

        $grades = Grade::with(['subject'])
            ->where('student_id', $student->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($grades);
    }

    public function gradesToManage(Request $request)
    {
        $faculty = $request->user()->faculty;
        if (!$faculty) {
            return response()->json([]);
        }

        // Get subjects taught by this faculty
        $subjectIds = \App\Models\Subject::where('faculty_id', $faculty->id)->pluck('id');

        $grades = Grade::with(['student.user', 'subject'])
            ->whereIn('subject_id', $subjectIds)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($grades);
    }
}

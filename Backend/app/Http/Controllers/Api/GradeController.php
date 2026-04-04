<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use Illuminate\Http\Request;

class GradeController extends Controller
{
    public function index(Request $request)
    {
        $query = Grade::with(['student.user', 'subject', 'faculty.user']);

        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->has('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }

        if ($request->has('faculty_id')) {
            $query->where('faculty_id', $request->faculty_id);
        }

        if ($request->has('academic_year')) {
            $query->where('academic_year', $request->academic_year);
        }

        if ($request->has('semester')) {
            $query->where('semester', $request->semester);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'subject_id' => 'required|exists:subjects,id',
            'academic_year' => 'required|string',
            'semester' => 'required|integer|min:1|max:2',
            'midterm_grade' => 'nullable|numeric|min:0|max:100',
            'final_grade' => 'nullable|numeric|min:0|max:100',
            'remarks' => 'nullable|string',
        ]);

        // Calculate total grade
        $totalGrade = null;
        if (isset($validated['midterm_grade']) && isset($validated['final_grade'])) {
            $totalGrade = ($validated['midterm_grade'] + $validated['final_grade']) / 2;
        }

        $grade = Grade::create([
            ...$validated,
            'faculty_id' => $request->user()->faculty->id,
            'total_grade' => $totalGrade,
        ]);

        return response()->json($grade->load(['student.user', 'subject', 'faculty.user']), 201);
    }

    public function show(Grade $grade)
    {
        return response()->json($grade->load(['student.user', 'subject', 'faculty.user']));
    }

    public function update(Request $request, Grade $grade)
    {
        if ($grade->is_locked) {
            return response()->json(['message' => 'Grade is locked and cannot be modified'], 403);
        }

        $validated = $request->validate([
            'midterm_grade' => 'nullable|numeric|min:0|max:100',
            'final_grade' => 'nullable|numeric|min:0|max:100',
            'remarks' => 'nullable|string',
        ]);

        // Recalculate total grade
        $midterm = $validated['midterm_grade'] ?? $grade->midterm_grade;
        $final = $validated['final_grade'] ?? $grade->final_grade;
        $totalGrade = null;
        if ($midterm !== null && $final !== null) {
            $totalGrade = ($midterm + $final) / 2;
        }

        $grade->update([
            ...$validated,
            'total_grade' => $totalGrade,
        ]);

        return response()->json($grade->load(['student.user', 'subject', 'faculty.user']));
    }

    public function lock(Request $request, Grade $grade)
    {
        // Only admin or the faculty who created can lock
        if (!$request->user()->isAdmin() && $grade->faculty_id !== $request->user()->faculty->id) {
            return response()->json(['message' => 'Unauthorized to lock this grade'], 403);
        }

        $grade->update(['is_locked' => true]);
        return response()->json(['message' => 'Grade locked successfully']);
    }

    public function myGrades(Request $request)
    {
        $grades = Grade::with(['subject', 'faculty.user'])
            ->where('student_id', $request->user()->student->id)
            ->orderBy('academic_year', 'desc')
            ->orderBy('semester', 'desc')
            ->get();

        return response()->json($grades);
    }

    public function gradesToManage(Request $request)
    {
        $facultyId = $request->user()->faculty->id;
        $subjectIds = \App\Models\Schedule::where('faculty_id', $facultyId)->pluck('subject_id');

        $grades = Grade::with(['student.user', 'subject'])
            ->whereIn('subject_id', $subjectIds)
            ->orderBy('academic_year', 'desc')
            ->orderBy('semester', 'desc')
            ->get();

        return response()->json($grades);
    }
}

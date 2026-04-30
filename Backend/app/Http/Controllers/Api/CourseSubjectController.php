<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CourseSubject;
use Illuminate\Http\Request;

class CourseSubjectController extends Controller
{
    public function index(Request $request)
    {
        $query = CourseSubject::with(['course', 'subject']);

        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        if ($request->has('year_level')) {
            $query->where('year_level', $request->year_level);
        }

        if ($request->has('semester')) {
            $query->where('semester', $request->semester);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'subject_id' => 'required|exists:subjects,id',
            'year_level' => 'required|integer|min:1|max:5',
            'semester' => 'required|in:1,2',
            'is_active' => 'sometimes|boolean',
        ]);

        $courseSubject = CourseSubject::create($validated);
        return response()->json($courseSubject->load(['course', 'subject']), 201);
    }

    public function show(CourseSubject $courseSubject)
    {
        return response()->json($courseSubject->load(['course', 'subject']));
    }

    public function update(Request $request, CourseSubject $courseSubject)
    {
        $validated = $request->validate([
            'year_level' => 'sometimes|integer|min:1|max:5',
            'semester' => 'sometimes|in:1,2',
            'is_active' => 'sometimes|boolean',
        ]);

        $courseSubject->update($validated);
        return response()->json($courseSubject->load(['course', 'subject']));
    }

    public function destroy(CourseSubject $courseSubject)
    {
        $courseSubject->delete();
        return response()->json(['message' => 'Course subject deleted successfully']);
    }
}

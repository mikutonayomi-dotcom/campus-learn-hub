<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::withCount(['subjects', 'students', 'sections'])->get();
        return response()->json($courses);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:courses',
            'name' => 'required|string',
            'description' => 'nullable|string',
            'duration_years' => 'required|integer|min:1|max:5',
        ]);

        $course = Course::create($validated);
        return response()->json($course, 201);
    }

    public function show(Course $course)
    {
        return response()->json($course->load(['subjects', 'sections', 'students']));
    }

    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'description' => 'nullable|string',
            'duration_years' => 'sometimes|integer|min:1|max:5',
            'is_active' => 'sometimes|boolean',
        ]);

        $course->update($validated);
        return response()->json($course);
    }

    public function destroy(Course $course)
    {
        $course->delete();
        return response()->json(['message' => 'Course deleted successfully']);
    }
}

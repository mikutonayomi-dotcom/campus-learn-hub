<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Subject::with('course');

        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        if ($request->has('year_level')) {
            $query->where('year_level', $request->year_level);
        }

        if ($request->has('semester')) {
            $query->whereHas('courseSubjects', function ($q) use ($request) {
                $q->where('semester', $request->semester);
            });
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:subjects',
            'name' => 'required|string',
            'description' => 'nullable|string',
            'course_id' => 'required|exists:courses,id',
            'year_level' => 'required|integer|min:1|max:5',
            'semester' => 'required|integer|min:1|max:2',
            'faculty_id' => 'nullable|exists:faculty,id',
        ]);

        $subject = Subject::create($validated);
        return response()->json($subject->load('course'), 201);
    }

    public function show(Subject $subject)
    {
        return response()->json($subject->load(['course', 'materials', 'schedules.section', 'schedules.room']));
    }

    public function update(Request $request, Subject $subject)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'description' => 'nullable|string',
            'year_level' => 'sometimes|integer|min:1|max:5',
            'semester' => 'sometimes|integer|min:1|max:2',
            'faculty_id' => 'nullable|exists:faculty,id',
        ]);

        $subject->update($validated);
        return response()->json($subject->load('course'));
    }

    public function destroy(Subject $subject)
    {
        $subject->delete();
        return response()->json(['message' => 'Subject deleted successfully']);
    }
}

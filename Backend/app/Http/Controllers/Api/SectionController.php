<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Section;
use Illuminate\Http\Request;

class SectionController extends Controller
{
    public function index(Request $request)
    {
        $query = Section::with('course');

        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        if ($request->has('year_level')) {
            $query->where('year_level', $request->year_level);
        }

        if ($request->has('academic_year')) {
            $query->where('academic_year', $request->academic_year);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'course_id' => 'required|exists:courses,id',
            'year_level' => 'required|integer|min:1|max:5',
            'academic_year' => 'required|string',
        ]);

        $section = Section::create($validated);
        return response()->json($section->load('course'), 201);
    }

    public function show(Section $section)
    {
        return response()->json($section->load(['course', 'schedules.subject', 'schedules.faculty.user', 'schedules.room']));
    }

    public function update(Request $request, Section $section)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'year_level' => 'sometimes|integer|min:1|max:5',
            'academic_year' => 'sometimes|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $section->update($validated);
        return response()->json($section->load('course'));
    }

    public function destroy(Section $section)
    {
        $section->delete();
        return response()->json(['message' => 'Section deleted successfully']);
    }

    public function students(Section $section)
    {
        $students = \App\Models\Student::with('user', 'course')
            ->where('section', $section->name)
            ->where('course_id', $section->course_id)
            ->get();

        return response()->json($students);
    }
}

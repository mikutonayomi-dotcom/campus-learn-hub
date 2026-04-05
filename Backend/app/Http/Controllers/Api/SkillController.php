<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use App\Models\StudentSkill;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function index()
    {
        $skills = Skill::withCount('students')->get();
        return response()->json($skills);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'category' => 'required|in:technical,sports,arts,leadership,communication,other',
            'description' => 'nullable|string',
        ]);

        $skill = Skill::create($validated);
        return response()->json($skill, 201);
    }

    public function show(Skill $skill)
    {
        return response()->json($skill->load(['students.user']));
    }

    public function update(Request $request, Skill $skill)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'category' => 'sometimes|in:technical,sports,arts,leadership,communication,other',
            'description' => 'nullable|string',
        ]);

        $skill->update($validated);
        return response()->json($skill);
    }

    public function destroy(Skill $skill)
    {
        $skill->delete();
        return response()->json(['message' => 'Skill deleted successfully']);
    }

    public function addToStudent(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'skill_id' => 'required|exists:skills,id',
            'level' => 'required|in:beginner,intermediate,advanced,expert',
            'proof_path' => 'nullable|string',
        ]);

        $studentSkill = StudentSkill::updateOrCreate(
            [
                'student_id' => $validated['student_id'],
                'skill_id' => $validated['skill_id'],
            ],
            [
                'level' => $validated['level'],
                'proof_path' => $validated['proof_path'] ?? null,
            ]
        );

        return response()->json($studentSkill->load(['student.user', 'skill']), 201);
    }

    public function removeFromStudent(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'skill_id' => 'required|exists:skills,id',
        ]);

        StudentSkill::where('student_id', $validated['student_id'])
            ->where('skill_id', $validated['skill_id'])
            ->delete();

        return response()->json(['message' => 'Skill removed from student']);
    }

    public function verifyStudentSkill(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'skill_id' => 'required|exists:skills,id',
        ]);

        $studentSkill = StudentSkill::where('student_id', $validated['student_id'])
            ->where('skill_id', $validated['skill_id'])
            ->firstOrFail();

        $studentSkill->update(['is_verified' => true]);

        return response()->json($studentSkill->load(['student.user', 'skill']));
    }

    public function mySkills(Request $request)
    {
        $student = $request->user()->student;
        if (!$student) {
            return response()->json([]);
        }

        $skills = StudentSkill::with('skill')
            ->where('student_id', $student->id)
            ->get();

        return response()->json($skills);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use Illuminate\Http\Request;

class AchievementController extends Controller
{
    public function index(Request $request)
    {
        $query = Achievement::with(['student.user']);

        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('my_achievements') && $request->user()->isStudent()) {
            $student = $request->user()->student;
            if ($student) {
                $query->where('student_id', $student->id);
            }
        }

        return response()->json($query->orderBy('date', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'title' => 'required|string',
            'description' => 'required|string',
            'date' => 'required|date',
            'category' => 'nullable|string',
        ]);

        $achievement = Achievement::create($validated);

        return response()->json($achievement->load(['student.user']), 201);
    }

    public function show(Achievement $achievement)
    {
        return response()->json($achievement->load(['student.user']));
    }

    public function update(Request $request, Achievement $achievement)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string',
            'description' => 'sometimes|string',
            'date' => 'sometimes|date',
            'category' => 'nullable|string',
        ]);

        $achievement->update($validated);
        return response()->json($achievement->load(['student.user']));
    }

    public function destroy(Achievement $achievement)
    {
        $achievement->delete();
        return response()->json(['message' => 'Achievement deleted successfully']);
    }

    public function approve(Request $request, Achievement $achievement)
    {
        $achievement->update(['status' => 'approved']);
        return response()->json($achievement->load(['student.user']));
    }

    public function reject(Request $request, Achievement $achievement)
    {
        $achievement->update(['status' => 'rejected']);
        return response()->json($achievement->load(['student.user']));
    }

    public function pendingCount()
    {
        $count = Achievement::where('status', 'pending')->count();
        return response()->json(['count' => $count]);
    }
}

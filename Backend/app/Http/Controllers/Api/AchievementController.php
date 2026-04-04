<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use Illuminate\Http\Request;

class AchievementController extends Controller
{
    public function index(Request $request)
    {
        $query = Achievement::with(['student.user', 'recorder.user', 'approver']);

        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('recorded_by')) {
            $query->where('recorded_by', $request->recorded_by);
        }

        if ($request->has('my_achievements') && $request->user()->isStudent()) {
            $query->where('student_id', $request->user()->student->id);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'title' => 'required|string',
            'type' => 'required|in:academic,non_academic,sports,leadership,other',
            'description' => 'required|string',
            'achievement_date' => 'required|date',
            'organization' => 'nullable|string',
            'proof_path' => 'nullable|string',
        ]);

        $achievement = Achievement::create([
            ...$validated,
            'recorded_by' => $request->user()->faculty->id,
            'status' => 'pending',
        ]);

        return response()->json($achievement->load(['student.user', 'recorder.user']), 201);
    }

    public function show(Achievement $achievement)
    {
        return response()->json($achievement->load(['student.user', 'recorder.user', 'approver']));
    }

    public function update(Request $request, Achievement $achievement)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string',
            'type' => 'sometimes|in:academic,non_academic,sports,leadership,other',
            'description' => 'sometimes|string',
            'achievement_date' => 'sometimes|date',
            'organization' => 'nullable|string',
            'proof_path' => 'nullable|string',
        ]);

        if ($achievement->status !== 'pending') {
            return response()->json(['message' => 'Cannot edit approved/rejected achievement'], 403);
        }

        $achievement->update($validated);
        return response()->json($achievement->load(['student.user', 'recorder.user']));
    }

    public function destroy(Achievement $achievement)
    {
        if ($achievement->status !== 'pending') {
            return response()->json(['message' => 'Cannot delete approved/rejected achievement'], 403);
        }

        $achievement->delete();
        return response()->json(['message' => 'Achievement deleted successfully']);
    }

    public function approve(Request $request, Achievement $achievement)
    {
        $validated = $request->validate([
            'admin_remarks' => 'nullable|string',
        ]);

        $achievement->update([
            'status' => 'approved',
            'admin_remarks' => $validated['admin_remarks'] ?? null,
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        return response()->json($achievement->load(['student.user', 'recorder.user', 'approver']));
    }

    public function reject(Request $request, Achievement $achievement)
    {
        $validated = $request->validate([
            'admin_remarks' => 'required|string',
        ]);

        $achievement->update([
            'status' => 'rejected',
            'admin_remarks' => $validated['admin_remarks'],
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        return response()->json($achievement->load(['student.user', 'recorder.user', 'approver']));
    }

    public function pendingCount()
    {
        $count = Achievement::where('status', 'pending')->count();
        return response()->json(['count' => $count]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Violation;
use Illuminate\Http\Request;

class ViolationController extends Controller
{
    public function index(Request $request)
    {
        $query = Violation::with(['student.user', 'reporter.user', 'approver']);

        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('severity')) {
            $query->where('severity', $request->severity);
        }

        if ($request->has('reported_by')) {
            $query->where('reported_by', $request->reported_by);
        }

        if ($request->has('my_violations') && $request->user()->isStudent()) {
            $query->where('student_id', $request->user()->student->id);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'type' => 'required|string',
            'severity' => 'required|in:minor,major,grave',
            'description' => 'required|string',
            'violation_date' => 'required|date',
            'evidence_path' => 'nullable|string',
        ]);

        $violation = Violation::create([
            ...$validated,
            'reported_by' => $request->user()->faculty->id,
            'status' => 'pending',
        ]);

        return response()->json($violation->load(['student.user', 'reporter.user']), 201);
    }

    public function show(Violation $violation)
    {
        return response()->json($violation->load(['student.user', 'reporter.user', 'approver']));
    }

    public function update(Request $request, Violation $violation)
    {
        $validated = $request->validate([
            'type' => 'sometimes|string',
            'severity' => 'sometimes|in:minor,major,grave',
            'description' => 'sometimes|string',
            'violation_date' => 'sometimes|date',
            'evidence_path' => 'nullable|string',
        ]);

        if ($violation->status !== 'pending') {
            return response()->json(['message' => 'Cannot edit approved/rejected violation'], 403);
        }

        $violation->update($validated);
        return response()->json($violation->load(['student.user', 'reporter.user']));
    }

    public function destroy(Violation $violation)
    {
        if ($violation->status !== 'pending') {
            return response()->json(['message' => 'Cannot delete approved/rejected violation'], 403);
        }

        $violation->delete();
        return response()->json(['message' => 'Violation deleted successfully']);
    }

    public function approve(Request $request, Violation $violation)
    {
        $validated = $request->validate([
            'admin_remarks' => 'nullable|string',
        ]);

        $violation->update([
            'status' => 'approved',
            'admin_remarks' => $validated['admin_remarks'] ?? null,
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        return response()->json($violation->load(['student.user', 'reporter.user', 'approver']));
    }

    public function reject(Request $request, Violation $violation)
    {
        $validated = $request->validate([
            'admin_remarks' => 'required|string',
        ]);

        $violation->update([
            'status' => 'rejected',
            'admin_remarks' => $validated['admin_remarks'],
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        return response()->json($violation->load(['student.user', 'reporter.user', 'approver']));
    }

    public function pendingCount()
    {
        $count = Violation::where('status', 'pending')->count();
        return response()->json(['count' => $count]);
    }
}

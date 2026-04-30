<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Violation;
use Illuminate\Http\Request;

class ViolationController extends Controller
{
    public function index(Request $request)
    {
        $query = Violation::with(['student.user', 'reporter.user', 'approver', 'violationType']);

        // Role-based visibility
        if ($request->user()->isStudent()) {
            // Students only see violations they reported
            $student = $request->user()->student;
            if ($student) {
                $query->where(function ($q) use ($student) {
                    $q->where('reported_by', $student->id)
                      ->where('reporter_type', 'student');
                });
            }
        } elseif ($request->user()->isFaculty()) {
            // Faculty see all violations they reported
            $faculty = $request->user()->faculty;
            if ($faculty) {
                $query->where(function ($q) use ($faculty) {
                    $q->where('reported_by', $faculty->id)
                      ->where('reporter_type', 'faculty');
                });
            }
        }
        // Admin sees all violations (no filtering)

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

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'violation_type_id' => 'required|exists:violation_types,id',
            'description' => 'required|string',
            'violation_date' => 'required|date',
            'evidence_path' => 'nullable|string',
        ]);

        // Get violation type to auto-assign severity
        $violationType = \App\Models\ViolationType::findOrFail($validated['violation_type_id']);

        $reporterId = null;
        $reporterType = null;

        if ($request->user()->isFaculty()) {
            $faculty = $request->user()->faculty;
            if (!$faculty) {
                return response()->json(['message' => 'Faculty profile not found'], 404);
            }
            $reporterId = $faculty->id;
            $reporterType = 'faculty';
        } elseif ($request->user()->isStudent()) {
            $student = $request->user()->student;
            if (!$student) {
                return response()->json(['message' => 'Student profile not found'], 404);
            }
            $reporterId = $student->id;
            $reporterType = 'student';
        } else {
            return response()->json(['message' => 'Unauthorized to report violations'], 403);
        }

        $violation = Violation::create([
            'student_id' => $validated['student_id'],
            'type' => $violationType->name,
            'violation_type_id' => $validated['violation_type_id'],
            'severity' => $violationType->severity,
            'description' => $validated['description'],
            'violation_date' => $validated['violation_date'],
            'evidence_path' => $validated['evidence_path'] ?? null,
            'reported_by' => $reporterId,
            'reporter_type' => $reporterType,
            'status' => 'pending',
        ]);

        return response()->json($violation->load(['student.user', 'reporter.user', 'violationType']), 201);
    }

    public function show(Violation $violation)
    {
        return response()->json($violation->load(['student.user', 'reporter.user', 'approver', 'violationType']));
    }

    public function update(Request $request, Violation $violation)
    {
        $validated = $request->validate([
            'violation_type_id' => 'sometimes|exists:violation_types,id',
            'description' => 'sometimes|string',
            'violation_date' => 'sometimes|date',
            'evidence_path' => 'nullable|string',
        ]);

        if ($violation->status !== 'pending') {
            return response()->json(['message' => 'Cannot edit approved/rejected violation'], 403);
        }

        // If violation_type_id is provided, update type and severity
        if (isset($validated['violation_type_id'])) {
            $violationType = \App\Models\ViolationType::findOrFail($validated['violation_type_id']);
            $validated['type'] = $violationType->name;
            $validated['severity'] = $violationType->severity;
        }

        $violation->update($validated);
        return response()->json($violation->load(['student.user', 'reporter.user', 'violationType']));
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

    public function getViolationTypes()
    {
        $violationTypes = \App\Models\ViolationType::orderBy('severity')->orderBy('name')->get();
        return response()->json($violationTypes);
    }
}

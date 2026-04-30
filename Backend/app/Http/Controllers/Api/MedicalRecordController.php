<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MedicalRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MedicalRecordController extends Controller
{
    public function index(Request $request)
    {
        $query = MedicalRecord::with(['student.user', 'verifier']);

        if ($request->user()->isStudent()) {
            $student = $request->user()->student;
            if (!$student) {
                return response()->json([]);
            }
            $query->where('student_id', $student->id);
        }

        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->has('is_verified')) {
            $query->where('is_verified', $request->boolean('is_verified'));
        }

        return response()->json($query->orderBy('record_date', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'sometimes|exists:students,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240', // Max 10MB
            'record_date' => 'required|date',
        ]);

        // Auto-detect student_id for students uploading their own records
        if ($request->user()->isStudent()) {
            $student = $request->user()->student;
            if (!$student) {
                return response()->json(['error' => 'Student profile not found'], 404);
            }
            $validated['student_id'] = $student->id;
        }

        $file = $request->file('file');
        $fileName = time() . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('medical_records', $fileName, 'public');

        $validated['file_path'] = $filePath;
        $validated['file_type'] = $file->getClientOriginalExtension();
        $validated['file_size'] = $file->getSize();

        unset($validated['file']);

        $record = MedicalRecord::create($validated);

        return response()->json($record->load(['student.user', 'verifier']), 201);
    }

    public function show(MedicalRecord $medicalRecord)
    {
        return response()->json($medicalRecord->load(['student.user', 'verifier']));
    }

    public function update(Request $request, MedicalRecord $medicalRecord)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'record_date' => 'sometimes|date',
        ]);

        $medicalRecord->update($validated);

        return response()->json($medicalRecord->load(['student.user', 'verifier']));
    }

    public function destroy(MedicalRecord $medicalRecord)
    {
        // Delete file from storage
        if (Storage::disk('public')->exists($medicalRecord->file_path)) {
            Storage::disk('public')->delete($medicalRecord->file_path);
        }

        $medicalRecord->delete();
        return response()->json(['message' => 'Medical record deleted successfully']);
    }

    public function verify(Request $request, MedicalRecord $medicalRecord)
    {
        $validated = $request->validate([
            'is_verified' => 'required|boolean',
        ]);

        $medicalRecord->update([
            'is_verified' => $validated['is_verified'],
            'verified_by' => $request->user()->id,
            'verified_at' => now(),
        ]);

        return response()->json($medicalRecord->load(['student.user', 'verifier']));
    }
}

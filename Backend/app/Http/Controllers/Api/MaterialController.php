<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use Illuminate\Http\Request;

class MaterialController extends Controller
{
    public function index(Request $request)
    {
        $query = Material::with(['subject', 'uploader.user']);

        if ($request->has('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }

        if ($request->has('uploaded_by')) {
            $query->where('uploaded_by', $request->uploaded_by);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('is_published')) {
            $query->where('is_published', $request->boolean('is_published'));
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'subject_id' => 'required|exists:subjects,id',
                'title' => 'required|string',
                'description' => 'nullable|string',
                'type' => 'nullable|in:pdf,video,link,doc,image,other',
                'file_path' => 'nullable|string',
                'external_link' => 'nullable|url',
            ]);

            $faculty = $request->user()->faculty;
            if (!$faculty) {
                return response()->json(['message' => 'Faculty profile not found'], 404);
            }

            // Handle file upload if present
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                
                // Validate file is valid
                if (!$file->isValid()) {
                    return response()->json(['error' => 'File upload failed'], 400);
                }
                
                $path = $file->store('materials', 'public');
                $validated['file_path'] = $path;
                $validated['original_filename'] = $file->getClientOriginalName();
                
                // Auto-detect type from file if not provided
                if (!isset($validated['type'])) {
                    $extension = $file->getClientOriginalExtension();
                    $typeMap = [
                        'pdf' => 'pdf',
                        'doc' => 'doc',
                        'docx' => 'doc',
                        'mp4' => 'video',
                        'mov' => 'video',
                        'avi' => 'video',
                        'jpg' => 'image',
                        'jpeg' => 'image',
                        'png' => 'image',
                        'gif' => 'image',
                    ];
                    $validated['type'] = $typeMap[$extension] ?? 'other';
                }
            }

            // Default type if still not set
            if (!isset($validated['type'])) {
                $validated['type'] = 'other';
            }

            $material = Material::create([
                ...$validated,
                'uploaded_by' => $faculty->id,
                'is_published' => true,
            ]);

            return response()->json($material->load(['subject', 'uploader.user']), 201);
        } catch (\Exception $e) {
            \Log::error('Material store error: ' . $e->getMessage());
            \Log::error('Material store trace: ' . $e->getTraceAsString());
            return response()->json(['error' => 'Failed to upload material: ' . $e->getMessage()], 500);
        }
    }

    public function show(Material $material)
    {
        return response()->json($material->load(['subject', 'uploader.user', 'submissions.student.user']));
    }

    public function download(Material $material)
    {
        if (!$material->file_path) {
            return response()->json(['error' => 'No file associated with this material'], 404);
        }

        $filePath = storage_path('app/public/' . $material->file_path);
        
        if (!file_exists($filePath)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        // Use original filename if available, otherwise use title with extension
        $downloadName = $material->original_filename ?? ($material->title . '.' . pathinfo($filePath, PATHINFO_EXTENSION));
        
        return response()->download($filePath, $downloadName);
    }

    public function update(Request $request, Material $material)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string',
            'description' => 'nullable|string',
            'type' => 'sometimes|in:pdf,video,link,doc,image,other',
            'file_path' => 'nullable|string',
            'external_link' => 'nullable|url',
            'is_published' => 'sometimes|boolean',
        ]);

        $material->update($validated);
        return response()->json($material->load(['subject', 'uploader.user']));
    }

    public function destroy(Material $material)
    {
        $material->delete();
        return response()->json(['message' => 'Material deleted successfully']);
    }

    public function myMaterials(Request $request)
    {
        try {
            if ($request->user()->isStudent()) {
                $student = $request->user()->student;
                if (!$student || !$student->section_id) {
                    return response()->json([]);
                }
                $subjectIds = \App\Models\Schedule::where('section_id', $student->section_id)->pluck('subject_id');

                $materials = Material::with(['subject', 'uploader.user'])
                    ->whereIn('subject_id', $subjectIds)
                    ->where('is_published', true)
                    ->orderBy('created_at', 'desc')
                    ->get();
            } else {
                $faculty = $request->user()->faculty;
                if (!$faculty) {
                    return response()->json([]);
                }
                $materials = Material::with(['subject', 'uploader.user'])
                    ->where('uploaded_by', $faculty->id)
                    ->orderBy('created_at', 'desc')
                    ->get();
            }

            return response()->json($materials);
        } catch (\Exception $e) {
            \Log::error('myMaterials error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch materials'], 500);
        }
    }
}

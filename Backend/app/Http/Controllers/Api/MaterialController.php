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
        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'title' => 'required|string',
            'description' => 'nullable|string',
            'type' => 'required|in:pdf,video,link,doc,image,other',
            'file_path' => 'nullable|string',
            'external_link' => 'nullable|url',
        ]);

        $material = Material::create([
            ...$validated,
            'uploaded_by' => $request->user()->faculty->id,
            'is_published' => true,
        ]);

        return response()->json($material->load(['subject', 'uploader.user']), 201);
    }

    public function show(Material $material)
    {
        return response()->json($material->load(['subject', 'uploader.user', 'submissions.student.user']));
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
        if ($request->user()->isStudent()) {
            $student = $request->user()->student;
            $subjectIds = \App\Models\Schedule::whereHas('section', function ($q) use ($student) {
                $q->where('name', $student->section)
                  ->where('course_id', $student->course_id);
            })->pluck('subject_id');

            $materials = Material::with(['subject', 'uploader.user'])
                ->whereIn('subject_id', $subjectIds)
                ->where('is_published', true)
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            $materials = Material::with(['subject', 'uploader.user'])
                ->where('uploaded_by', $request->user()->faculty->id)
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return response()->json($materials);
    }
}

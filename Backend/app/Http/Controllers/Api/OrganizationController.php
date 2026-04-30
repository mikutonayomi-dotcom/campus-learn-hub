<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use Illuminate\Http\Request;

class OrganizationController extends Controller
{
    public function index(Request $request)
    {
        $query = Organization::with(['adviser.user', 'members.user']);

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('adviser_id')) {
            $query->where('adviser_id', $request->adviser_id);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'adviser_id' => 'required|exists:faculty,id',
            'category' => 'required|string',
        ]);

        $organization = Organization::create($validated);
        return response()->json($organization->load(['adviser.user']), 201);
    }

    public function show(Organization $organization)
    {
        return response()->json($organization->load([
            'adviser.user',
            'members.user',
            'organizationMembers.student.user'
        ]));
    }

    public function update(Request $request, Organization $organization)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'description' => 'sometimes|string',
            'adviser_id' => 'sometimes|exists:faculty,id',
            'category' => 'sometimes|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $organization->update($validated);
        return response()->json($organization->load(['adviser.user', 'members.user']));
    }

    public function destroy(Organization $organization)
    {
        $organization->delete();
        return response()->json(['message' => 'Organization deleted successfully']);
    }

    public function addMember(Request $request, Organization $organization)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'role' => 'required|in:member,officer,president,vice_president,secretary,treasurer',
            'joined_at' => 'required|date',
        ]);

        if ($organization->members()->where('student_id', $validated['student_id'])->exists()) {
            return response()->json(['message' => 'Student is already a member'], 422);
        }

        $organization->members()->attach($validated['student_id'], [
            'role' => $validated['role'],
            'joined_at' => $validated['joined_at'],
        ]);

        return response()->json(['message' => 'Member added successfully']);
    }

    public function removeMember(Request $request, Organization $organization)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'left_at' => 'nullable|date',
        ]);

        $organization->members()->updateExistingPivot($validated['student_id'], [
            'left_at' => $validated['left_at'] ?? now(),
        ]);

        return response()->json(['message' => 'Member removed successfully']);
    }

    public function myOrganizations(Request $request)
    {
        try {
            if ($request->user()->isStudent()) {
                $student = $request->user()->student;
                if (!$student) {
                    return response()->json([]);
                }
                // Use the organizationMembers relationship for more reliable querying
                $organizations = Organization::with(['adviser.user', 'members.user'])
                    ->whereHas('organizationMembers', function ($q) use ($student) {
                        $q->where('student_id', $student->id)
                          ->whereNull('left_at');
                    })
                    ->get();
            } else {
                $faculty = $request->user()->faculty;
                if (!$faculty) {
                    return response()->json([]);
                }
                $organizations = Organization::with(['adviser.user', 'members.user'])
                    ->where('adviser_id', $faculty->id)
                    ->get();
            }

            return response()->json($organizations);
        } catch (\Exception $e) {
            \Log::error('myOrganizations error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch organizations'], 500);
        }
    }
}

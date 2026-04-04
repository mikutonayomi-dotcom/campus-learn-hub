<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faculty;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class FacultyController extends Controller
{
    public function index(Request $request)
    {
        $query = Faculty::with(['user', 'schedules']);

        if ($request->has('department')) {
            $query->where('department', $request->department);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            })->orWhere('employee_id', 'like', "%{$search}%");
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'employee_id' => 'required|string|unique:faculty',
            'department' => 'required|string',
            'position' => 'required|string',
            'specialization' => 'nullable|string',
            'contact_number' => 'nullable|string',
            'office_location' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'faculty',
        ]);

        $faculty = Faculty::create([
            'user_id' => $user->id,
            'employee_id' => $validated['employee_id'],
            'department' => $validated['department'],
            'position' => $validated['position'],
            'specialization' => $validated['specialization'] ?? null,
            'contact_number' => $validated['contact_number'] ?? null,
            'office_location' => $validated['office_location'] ?? null,
        ]);

        return response()->json($faculty->load('user'), 201);
    }

    public function show(Faculty $faculty)
    {
        return response()->json($faculty->load([
            'user', 'schedules.subject', 'schedules.section', 'schedules.room',
            'materials', 'organizations'
        ]));
    }

    public function update(Request $request, Faculty $faculty)
    {
        $validated = $request->validate([
            'department' => 'sometimes|string',
            'position' => 'sometimes|string',
            'specialization' => 'nullable|string',
            'contact_number' => 'nullable|string',
            'office_location' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $faculty->update($validated);

        if ($request->has('name') || $request->has('email')) {
            $faculty->user->update($request->only(['name', 'email']));
        }

        return response()->json($faculty->load('user'));
    }

    public function destroy(Faculty $faculty)
    {
        $faculty->user->delete();
        return response()->json(['message' => 'Faculty deleted successfully']);
    }

    public function myProfile(Request $request)
    {
        $faculty = $request->user()->faculty;
        return response()->json($faculty->load([
            'user', 'schedules.subject', 'schedules.section', 'schedules.room'
        ]));
    }

    public function myStudents(Request $request)
    {
        $faculty = $request->user()->faculty;
        
        $sectionIds = $faculty->schedules()
            ->pluck('section_id')
            ->unique()
            ->toArray();

        $students = \App\Models\Student::with('user', 'course')
            ->whereIn('section', function ($query) use ($sectionIds) {
                $query->select('name')
                    ->from('sections')
                    ->whereIn('id', $sectionIds);
            })
            ->get();

        return response()->json($students);
    }
}

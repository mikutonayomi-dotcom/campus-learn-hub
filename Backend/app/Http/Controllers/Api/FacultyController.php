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
            'firstname' => 'required|string',
            'middlename' => 'nullable|string',
            'lastname' => 'required|string',
            'suffix' => 'nullable|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'employee_id' => 'required|string|unique:faculty',
            'department' => 'required|string',
            'position' => 'required|string',
            'employment_status' => 'nullable|in:Full-time,Part-time',
            'specialization' => 'nullable|string',
            'educational_attainment' => 'nullable|string',
            'contact_number' => 'nullable|string',
            'address' => 'nullable|string',
            'office_location' => 'nullable|string',
            'mother_name' => 'nullable|string',
            'father_name' => 'nullable|string',
            'gender' => 'nullable|in:male,female,other',
            'birthday' => 'nullable|date',
            'birthplace' => 'nullable|string',
            'religion' => 'nullable|string',
        ]);

        // Build full name from parts
        $fullName = $validated['firstname'];
        if (!empty($validated['middlename'])) {
            $fullName .= ' ' . $validated['middlename'];
        }
        $fullName .= ' ' . $validated['lastname'];
        if (!empty($validated['suffix'])) {
            $fullName .= ' ' . $validated['suffix'];
        }

        $user = User::create([
            'first_name' => $validated['firstname'],
            'middle_name' => $validated['middlename'] ?? null,
            'last_name' => $validated['lastname'],
            'suffix' => $validated['suffix'] ?? null,
            'name' => $fullName,
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'faculty',
            'contact_number' => $validated['contact_number'] ?? null,
            'address' => $validated['address'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'birthday' => $validated['birthday'] ?? null,
            'birthplace' => $validated['birthplace'] ?? null,
            'religion' => $validated['religion'] ?? null,
            'mother_name' => $validated['mother_name'] ?? null,
            'father_name' => $validated['father_name'] ?? null,
        ]);

        $faculty = Faculty::create([
            'user_id' => $user->id,
            'employee_id' => $validated['employee_id'],
            'department' => $validated['department'],
            'position' => $validated['position'],
            'employment_status' => $validated['employment_status'] ?? 'Full-time',
            'specialization' => $validated['specialization'] ?? null,
            'educational_attainment' => $validated['educational_attainment'] ?? null,
            'contact_number' => $validated['contact_number'] ?? null,
            'office_location' => $validated['office_location'] ?? null,
            'mother_name' => $validated['mother_name'] ?? null,
            'father_name' => $validated['father_name'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'birthday' => $validated['birthday'] ?? null,
            'birthplace' => $validated['birthplace'] ?? null,
            'religion' => $validated['religion'] ?? null,
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

        if ($request->has('name') || $request->has('email') || $request->has('profile_image')) {
            $faculty->user->update($request->only(['name', 'email', 'profile_image']));
        }

        return response()->json($faculty->load('user'));
    }

    public function updateProfileImage(Request $request)
    {
        try {
            $request->validate([
                'profile_image' => 'required|image|max:2048', // Max 2MB
            ]);

            $user = $request->user();

            if ($request->hasFile('profile_image')) {
                $file = $request->file('profile_image');
                $path = $file->store('profile-images', 'public');
                $user->update(['profile_image' => $path]);
            }

            return response()->json(['profile_image' => $user->profile_image]);
        } catch (\Exception $e) {
            \Log::error('Faculty updateProfileImage error: ' . $e->getMessage());
            \Log::error('Faculty updateProfileImage trace: ' . $e->getTraceAsString());
            return response()->json(['error' => 'Failed to upload profile image'], 500);
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $faculty = $request->user()->faculty;
            
            $validated = $request->validate([
                'contact_number' => 'nullable|string',
                'address' => 'nullable|string',
                'office_location' => 'nullable|string',
                'specialization' => 'nullable|string',
            ]);

            $faculty->update($validated);

            return response()->json($faculty->load('user'));
        } catch (\Exception $e) {
            \Log::error('Faculty updateProfile error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update profile'], 500);
        }
    }

    public function destroy(Faculty $faculty)
    {
        $faculty->user->delete();
        return response()->json(['message' => 'Faculty deleted successfully']);
    }

    public function myProfile(Request $request)
    {
        $faculty = $request->user()->faculty;
        
        if (!$faculty) {
            return response()->json([
                'message' => 'Faculty profile not found. Please contact administrator to set up your faculty profile.'
            ], 404);
        }
        
        return response()->json($faculty->load([
            'user', 'schedules.subject', 'schedules.section', 'schedules.room'
        ]));
    }

    public function myStudents(Request $request)
    {
        $faculty = $request->user()->faculty;
        
        if (!$faculty) {
            return response()->json([]);
        }
        
        $sectionIds = $faculty->schedules()
            ->pluck('section_id')
            ->unique()
            ->toArray();

        if (empty($sectionIds)) {
            return response()->json([]);
        }

        $students = \App\Models\Student::with('user', 'course', 'section')
            ->whereIn('section_id', $sectionIds)
            ->get();

        return response()->json($students);
    }

    public function myClasses(Request $request)
    {
        $faculty = $request->user()->faculty;
        
        if (!$faculty) {
            return response()->json([]);
        }

        $schedules = $faculty->schedules()
            ->with(['subject', 'section', 'room'])
            ->get()
            ->groupBy(function ($schedule) {
                return $schedule->subject_id . '-' . $schedule->section_id;
            })
            ->map(function ($group) {
                $first = $group->first();
                return [
                    'subject_id' => $first->subject_id,
                    'subject' => $first->subject,
                    'section_id' => $first->section_id,
                    'section' => $first->section,
                    'room' => $first->room,
                    'schedules' => $group,
                    'students_count' => $first->section ? $first->section->students()->count() : 0,
                ];
            })
            ->values();

        return response()->json($schedules);
    }

    public function getNextEmployeeId()
    {
        $currentYear = date('Y');
        $count = Faculty::whereYear('created_at', $currentYear)->count();
        $nextNumber = str_pad($count + 1, 2, '0', STR_PAD_LEFT);
        $nextId = 'FC-' . $currentYear . '-' . $nextNumber;
        
        return response()->json(['next_id' => $nextId]);
    }
}

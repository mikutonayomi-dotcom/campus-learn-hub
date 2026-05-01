<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Violation;
use App\Models\Achievement;
use App\Models\Grade;
use App\Models\OrganizationMember;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function searchStudents(Request $request)
    {
        $query = Student::with(['user', 'course', 'skills', 'organizations']);

        // Filter by course
        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        // Filter by section
        if ($request->has('section_id')) {
            $query->where('section_id', $request->section_id);
        }

        // Filter by year level
        if ($request->has('year_level')) {
            $query->where('year_level', $request->year_level);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by skills
        if ($request->has('skill_ids')) {
            $skillIds = is_array($request->skill_ids) ? $request->skill_ids : explode(',', $request->skill_ids);
            $query->whereHas('skills', function ($q) use ($skillIds) {
                $q->whereIn('skills.id', $skillIds);
            });
        }

        // Filter by GPA range
        if ($request->has('min_gpa') || $request->has('max_gpa')) {
            $query->whereHas('grades', function ($q) use ($request) {
                if ($request->has('min_gpa')) {
                    $q->havingRaw('AVG(total_grade) >= ?', [$request->min_gpa]);
                }
                if ($request->has('max_gpa')) {
                    $q->havingRaw('AVG(total_grade) <= ?', [$request->max_gpa]);
                }
            });
        }

        // Filter by violations
        if ($request->has('no_violations') && $request->boolean('no_violations')) {
            $query->doesntHave('violations');
        }

        if ($request->has('max_violations')) {
            $query->has('violations', '<=', $request->max_violations);
        }

        // Filter by achievements
        if ($request->has('has_achievements') && $request->boolean('has_achievements')) {
            $query->has('achievements');
        }

        if ($request->has('min_achievements')) {
            $query->has('achievements', '>=', $request->min_achievements);
        }

        // Filter by organization participation
        if ($request->has('organization_id')) {
            $query->whereHas('organizations', function ($q) use ($request) {
                $q->where('organizations.id', $request->organization_id);
            });
        }

        // Filter by event participation
        if ($request->has('event_id')) {
            $query->whereHas('events', function ($q) use ($request) {
                $q->where('events.id', $request->event_id);
            });
        }

        // Text search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($uq) use ($search) {
                    $uq->where('name', 'like', "%{$search}%")
                       ->orWhere('email', 'like', "%{$search}%");
                })
                ->orWhere('student_id', 'like', "%{$search}%");
            });
        }

        $students = $query->get();

        // Add computed fields
        $students->each(function ($student) {
            $student->gpa = Grade::where('student_id', $student->id)
                ->whereNotNull('total_grade')
                ->avg('total_grade');
            $student->violations_count = Violation::where('student_id', $student->id)->count();
            $student->achievements_count = Achievement::where('student_id', $student->id)->count();
        });

        return response()->json($students);
    }

    public function getFilterOptions()
    {
        return response()->json([
            'courses' => \App\Models\Course::all(['id', 'code', 'name']),
            'skills' => \App\Models\Skill::all(['id', 'name', 'category']),
            'organizations' => \App\Models\Organization::all(['id', 'name']),
            'year_levels' => [1, 2, 3, 4, 5],
            'sections' => \App\Models\Section::all(['id', 'name']),
        ]);
    }
}

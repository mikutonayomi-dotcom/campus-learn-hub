<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'student_id',
        'course_id',
        'section_id',
        'year_level',
        'semester',
        'mother_name',
        'father_name',
        'guardian_name',
        'gender',
        'birthday',
        'birthplace',
        'religion',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    public function subjects()
    {
        if (!$this->section_id) {
            return collect();
        }
        return Schedule::where('section_id', $this->section_id)
            ->with('subject.course')
            ->get()
            ->pluck('subject')
            ->filter()
            ->unique('id')
            ->values();
    }

    public function curriculumSubjects()
    {
        if (!$this->course_id) {
            return collect();
        }
        // Normalize semester: "1st" -> "1", "2nd" -> "2"
        $normalizedSemester = str_replace(['st', 'nd', 'rd', 'th'], '', $this->semester);
        return CourseSubject::where('course_id', $this->course_id)
            ->where('year_level', $this->year_level)
            ->where('semester', $normalizedSemester)
            ->with('subject.course')
            ->get()
            ->pluck('subject')
            ->filter()
            ->unique('id')
            ->values();
    }

    public function schedules()
    {
        if (!$this->section_id) {
            return collect();
        }
        // Get all curriculum subjects for the student
        $curriculumSubjects = $this->curriculumSubjects();
        
        // Get schedules for the student's section
        $sectionSchedules = Schedule::where('section_id', $this->section_id)
            ->with(['subject', 'room'])
            ->get()
            ->keyBy('subject_id');
        
        // Combine curriculum subjects with their schedules
        return $curriculumSubjects->map(function ($subject) use ($sectionSchedules) {
            $schedule = $sectionSchedules->get($subject->id);
            return [
                'subject' => $subject,
                'schedule' => $schedule,
                'has_schedule' => $schedule !== null,
            ];
        })->values();
    }

    public function violations(): HasMany
    {
        return $this->hasMany(Violation::class);
    }

    public function achievements(): HasMany
    {
        return $this->hasMany(Achievement::class);
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class);
    }

    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class);
    }

    public function attendance(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'student_skills')
            ->withPivot(['level', 'proof_path', 'is_verified'])
            ->withTimestamps();
    }

    public function organizations(): BelongsToMany
    {
        return $this->belongsToMany(Organization::class, 'organization_members')
            ->withPivot(['role', 'joined_at', 'left_at'])
            ->withTimestamps();
    }

    public function events(): BelongsToMany
    {
        return $this->belongsToMany(Event::class, 'event_participants')
            ->withPivot(['status', 'remarks'])
            ->withTimestamps();
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }
}

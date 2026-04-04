<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Grade extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'subject_id',
        'faculty_id',
        'academic_year',
        'semester',
        'midterm_grade',
        'final_grade',
        'total_grade',
        'remarks',
        'is_locked',
    ];

    protected $casts = [
        'midterm_grade' => 'decimal:2',
        'final_grade' => 'decimal:2',
        'total_grade' => 'decimal:2',
        'is_locked' => 'boolean',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function faculty(): BelongsTo
    {
        return $this->belongsTo(Faculty::class);
    }
}

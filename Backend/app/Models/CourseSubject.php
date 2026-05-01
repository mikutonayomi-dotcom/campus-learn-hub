<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseSubject extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'subject_id',
        'year_level',
        'semester',
    ];

    protected $casts = [
        'semester' => 'integer',
        'year_level' => 'integer',
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }
}

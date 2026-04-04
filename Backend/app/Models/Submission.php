<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Submission extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'material_id',
        'content',
        'file_path',
        'external_link',
        'status',
        'grade',
        'feedback',
        'graded_by',
        'submitted_at',
        'graded_at',
    ];

    protected $casts = [
        'grade' => 'decimal:2',
        'submitted_at' => 'datetime',
        'graded_at' => 'datetime',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class);
    }

    public function grader(): BelongsTo
    {
        return $this->belongsTo(Faculty::class, 'graded_by');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Violation extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'reported_by',
        'reporter_type',
        'type',
        'violation_type_id',
        'severity',
        'description',
        'violation_date',
        'evidence_path',
        'status',
        'admin_remarks',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'violation_date' => 'datetime',
        'approved_at' => 'datetime',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function reporter()
    {
        if ($this->reporter_type === 'faculty') {
            return $this->belongsTo(Faculty::class, 'reported_by');
        }
        return $this->belongsTo(Student::class, 'reported_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function violationType(): BelongsTo
    {
        return $this->belongsTo(ViolationType::class);
    }
}

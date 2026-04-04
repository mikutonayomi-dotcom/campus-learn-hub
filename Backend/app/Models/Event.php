<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'type',
        'start_date',
        'end_date',
        'venue',
        'organized_by',
        'status',
        'admin_remarks',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'approved_at' => 'datetime',
    ];

    public function organizer(): BelongsTo
    {
        return $this->belongsTo(Faculty::class, 'organized_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'event_participants')
            ->withPivot(['status', 'remarks'])
            ->withTimestamps();
    }
}

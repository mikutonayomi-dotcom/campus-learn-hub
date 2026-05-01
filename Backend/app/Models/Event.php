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
        'date',
        'start_date',
        'end_date',
        'time',
        'location',
        'venue',
        'status',
        'type',
        'organized_by',
        'organizer_type',
    ];

    protected $casts = [
        'date' => 'date',
        'start_date' => 'date',
        'end_date' => 'date',
        'time' => 'datetime',
    ];

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'event_participants')
            ->withPivot(['status', 'remarks'])
            ->withTimestamps();
    }

    public function organizer(): BelongsTo
    {
        if ($this->organizer_type === 'faculty') {
            return $this->belongsTo(Faculty::class, 'organized_by');
        }
        return $this->belongsTo(User::class, 'organized_by');
    }
}

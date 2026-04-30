<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Faculty extends Model
{
    use HasFactory;

    protected $table = 'faculty';

    protected $fillable = [
        'user_id',
        'employee_id',
        'department',
        'position',
        'employment_status',
        'specialization',
        'educational_attainment',
        'contact_number',
        'office_location',
        'is_active',
        'mother_name',
        'father_name',
        'gender',
        'birthday',
        'birthplace',
        'religion',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    public function materials(): HasMany
    {
        return $this->hasMany(Material::class);
    }

    public function violations(): HasMany
    {
        return $this->hasMany(Violation::class, 'reported_by');
    }

    public function achievements(): HasMany
    {
        return $this->hasMany(Achievement::class, 'recorded_by');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class, 'graded_by');
    }

    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class);
    }

    public function attendance(): HasMany
    {
        return $this->hasMany(Attendance::class, 'marked_by');
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class, 'organized_by');
    }

    public function organizations(): HasMany
    {
        return $this->hasMany(Organization::class, 'adviser_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Skill extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'description',
    ];

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'student_skills')
            ->withPivot(['level', 'proof_path', 'is_verified'])
            ->withTimestamps();
    }
}

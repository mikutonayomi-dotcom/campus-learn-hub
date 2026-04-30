<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ViolationType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'severity',
        'category',
        'description',
    ];

    protected $casts = [
        'severity' => 'string',
    ];

    public function violations()
    {
        return $this->hasMany(Violation::class);
    }
}

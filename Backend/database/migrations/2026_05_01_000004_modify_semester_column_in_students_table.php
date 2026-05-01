<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Modify the semester column from integer to string to accept '1st' and '2nd'
        DB::statement("ALTER TABLE students MODIFY COLUMN semester VARCHAR(10) DEFAULT '1st'");
    }

    public function down(): void
    {
        // Revert back to integer
        DB::statement("ALTER TABLE students MODIFY COLUMN semester INT DEFAULT 1");
    }
};

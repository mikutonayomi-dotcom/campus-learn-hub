<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Modify the semester enum to use '1st' and '2nd' instead of '1' and '2'
        DB::statement("ALTER TABLE sections MODIFY COLUMN semester ENUM('1st', '2nd') DEFAULT '1st'");
    }

    public function down(): void
    {
        // Revert back to '1' and '2'
        DB::statement("ALTER TABLE sections MODIFY COLUMN semester ENUM('1', '2') DEFAULT '1'");
    }
};

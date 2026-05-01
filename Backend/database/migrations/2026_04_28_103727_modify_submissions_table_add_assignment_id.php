<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            // Add assignment_id column (skip if already exists from base migration)
            if (!Schema::hasColumn('submissions', 'assignment_id')) {
                $table->foreignId('assignment_id')->nullable()->after('student_id')->constrained()->onDelete('set null');
            }

            // If material_id does not exist, add it for backward compatibility
            if (!Schema::hasColumn('submissions', 'material_id')) {
                $table->foreignId('material_id')->nullable()->after('assignment_id')->constrained()->onDelete('set null');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            $table->dropForeign(['assignment_id']);
            $table->dropColumn('assignment_id');
        });
    }
};

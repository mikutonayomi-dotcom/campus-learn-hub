<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('violations', function (Blueprint $table) {
            if (!Schema::hasColumn('violations', 'violation_type_id')) {
                $table->foreignId('violation_type_id')->nullable()->after('student_id')->constrained()->onDelete('set null');
            } else {
                // Column exists from base migration; check if foreign key constraint exists
                $foreignKeys = collect(DB::select("SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'violations' AND CONSTRAINT_NAME LIKE '%violation_type_id%'"));
                if ($foreignKeys->isEmpty()) {
                    $table->foreign('violation_type_id')->references('id')->on('violation_types')->onDelete('set null');
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('violations', function (Blueprint $table) {
            $table->dropForeign(['violation_type_id']);
            $table->dropColumn('violation_type_id');
        });
    }
};

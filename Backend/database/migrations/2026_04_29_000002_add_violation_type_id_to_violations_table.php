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
        Schema::table('violations', function (Blueprint $table) {
            if (!Schema::hasColumn('violations', 'violation_type_id')) {
                $table->foreignId('violation_type_id')->nullable()->after('type')->constrained()->onDelete('set null');
            } else {
                // Column exists from base migration; just add the foreign key constraint
                $table->foreign('violation_type_id')->references('id')->on('violation_types')->onDelete('set null');
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

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
        Schema::table('subjects', function (Blueprint $table) {
            $table->dropForeign(['course_id']);
            $table->foreignId('course_id')->nullable()->change();
            $table->integer('year_level')->nullable()->change();
            $table->enum('semester', ['1', '2'])->nullable()->change();
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Skip rollback for now due to foreign key constraint issues
        // This migration is one-way to support the course_subjects junction table
    }
};

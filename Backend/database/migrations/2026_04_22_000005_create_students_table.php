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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('student_id')->unique();
            $table->foreignId('course_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('section_id')->nullable()->constrained()->onDelete('set null');
            $table->integer('year_level')->nullable();
            $table->enum('semester', ['1st', '2nd'])->nullable();
            $table->string('contact_number')->nullable();
            $table->text('address')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_number')->nullable();
            $table->text('medical_records')->nullable();
            $table->enum('status', ['regular', 'irregular', 'transferee', 'returnee'])->default('regular');
            $table->string('mother_name')->nullable();
            $table->string('father_name')->nullable();
            $table->string('guardian_name')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->date('birthday')->nullable();
            $table->string('birthplace')->nullable();
            $table->string('religion')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};

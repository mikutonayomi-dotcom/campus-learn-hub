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
        Schema::create('faculty', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('employee_id')->unique();
            $table->string('department')->nullable();
            $table->string('position')->nullable();
            $table->enum('employment_status', ['Full-time', 'Part-time'])->default('Full-time');
            $table->string('specialization')->nullable();
            $table->string('educational_attainment')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('office_location')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('mother_name')->nullable();
            $table->string('father_name')->nullable();
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
        Schema::dropIfExists('faculty');
    }
};

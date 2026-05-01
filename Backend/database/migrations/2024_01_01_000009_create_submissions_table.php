<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('submissions')) {
            Schema::create('submissions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('assignment_id')->constrained();
                $table->foreignId('student_id')->constrained('students');
                $table->string('file_path');
                $table->string('original_filename')->nullable();
                $table->text('description')->nullable();
                $table->decimal('grade', 5, 2)->nullable();
                $table->text('feedback')->nullable();
                $table->boolean('is_graded')->default(false);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};

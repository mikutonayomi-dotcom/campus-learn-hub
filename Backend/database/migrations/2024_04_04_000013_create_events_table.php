<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->enum('type', ['academic', 'extra_curricular', 'sports', 'cultural', 'other']);
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->string('venue')->nullable();
            $table->foreignId('organized_by')->constrained('faculty')->onDelete('cascade');
            $table->enum('status', ['draft', 'pending', 'approved', 'rejected', 'ongoing', 'completed', 'cancelled'])->default('draft');
            $table->text('admin_remarks')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};

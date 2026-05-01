<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('violation_types')) {
            Schema::create('violation_types', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->enum('severity', ['low', 'medium', 'high']);
                $table->string('category')->nullable();
                $table->text('description')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('violation_types');
    }
};

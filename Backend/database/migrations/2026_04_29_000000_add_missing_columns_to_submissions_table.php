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
            // Add missing columns
            if (!Schema::hasColumn('submissions', 'title')) {
                $table->string('title')->nullable()->after('material_id');
            }
            if (!Schema::hasColumn('submissions', 'content')) {
                $table->text('content')->nullable()->after('title');
            }
            if (!Schema::hasColumn('submissions', 'description')) {
                $table->text('description')->nullable()->after('content');
            }
            if (!Schema::hasColumn('submissions', 'external_link')) {
                $table->string('external_link')->nullable()->after('file_path');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            $table->dropColumn(['title', 'content', 'description', 'external_link']);
        });
    }
};

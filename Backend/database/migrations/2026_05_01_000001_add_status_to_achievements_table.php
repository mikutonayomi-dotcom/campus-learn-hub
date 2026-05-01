<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('achievements', function (Blueprint $table) {
            if (!Schema::hasColumn('achievements', 'status')) {
                $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending')->after('category');
            }
            if (!Schema::hasColumn('achievements', 'organization')) {
                $table->string('organization')->nullable()->after('status');
            }
            if (!Schema::hasColumn('achievements', 'type')) {
                $table->string('type')->nullable()->after('organization');
            }
            if (!Schema::hasColumn('achievements', 'achievement_date')) {
                $table->date('achievement_date')->nullable()->after('date');
            }
        });
    }

    public function down(): void
    {
        Schema::table('achievements', function (Blueprint $table) {
            $table->dropColumn(['status', 'organization', 'type', 'achievement_date']);
        });
    }
};

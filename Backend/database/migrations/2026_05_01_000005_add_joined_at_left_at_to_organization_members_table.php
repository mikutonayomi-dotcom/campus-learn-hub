<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('organization_members', function (Blueprint $table) {
            $table->timestamp('joined_at')->nullable()->after('role');
            $table->timestamp('left_at')->nullable()->after('joined_at');
        });
    }

    public function down(): void
    {
        Schema::table('organization_members', function (Blueprint $table) {
            $table->dropColumn(['joined_at', 'left_at']);
        });
    }
};

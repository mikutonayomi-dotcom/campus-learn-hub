<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            if (!Schema::hasColumn('events', 'start_date')) {
                $table->date('start_date')->nullable()->after('date');
            }
            if (!Schema::hasColumn('events', 'end_date')) {
                $table->date('end_date')->nullable()->after('start_date');
            }
            if (!Schema::hasColumn('events', 'venue')) {
                $table->string('venue')->nullable()->after('location');
            }
            if (!Schema::hasColumn('events', 'type')) {
                $table->string('type')->nullable()->after('status');
            }
            if (!Schema::hasColumn('events', 'organized_by')) {
                $table->unsignedBigInteger('organized_by')->nullable()->after('type');
            }
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['start_date', 'end_date', 'venue', 'type', 'organized_by']);
        });
    }
};

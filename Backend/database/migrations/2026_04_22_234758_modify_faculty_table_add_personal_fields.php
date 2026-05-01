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
        Schema::table('faculty', function (Blueprint $table) {
            // Add employment status (skip if already exists from base migration)
            if (!Schema::hasColumn('faculty', 'employment_status')) {
                $table->enum('employment_status', ['Full-time', 'Part-time'])->default('Full-time')->after('position');
            }

            // Add educational attainment
            if (!Schema::hasColumn('faculty', 'educational_attainment')) {
                $table->string('educational_attainment')->nullable()->after('specialization');
            }

            // Add family information fields
            if (!Schema::hasColumn('faculty', 'mother_name')) {
                $table->string('mother_name')->nullable()->after('office_location');
            }
            if (!Schema::hasColumn('faculty', 'father_name')) {
                $table->string('father_name')->nullable()->after('mother_name');
            }

            // Add personal information fields
            if (!Schema::hasColumn('faculty', 'gender')) {
                $table->enum('gender', ['male', 'female', 'other'])->nullable()->after('father_name');
            }
            if (!Schema::hasColumn('faculty', 'birthday')) {
                $table->date('birthday')->nullable()->after('gender');
            }
            if (!Schema::hasColumn('faculty', 'birthplace')) {
                $table->string('birthplace')->nullable()->after('birthday');
            }
            if (!Schema::hasColumn('faculty', 'religion')) {
                $table->string('religion')->nullable()->after('birthplace');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('faculty', function (Blueprint $table) {
            $table->dropColumn([
                'employment_status',
                'educational_attainment',
                'mother_name',
                'father_name',
                'gender',
                'birthday',
                'birthplace',
                'religion'
            ]);
        });
    }
};

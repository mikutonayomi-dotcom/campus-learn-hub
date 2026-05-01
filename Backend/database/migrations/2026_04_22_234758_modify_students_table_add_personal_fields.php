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
        Schema::table('students', function (Blueprint $table) {
            // Add semester field (skip if already exists from base migration)
            if (!Schema::hasColumn('students', 'semester')) {
                $table->enum('semester', ['1st', '2nd'])->nullable()->after('year_level');
            }

            // Add family information fields
            if (!Schema::hasColumn('students', 'mother_name')) {
                $table->string('mother_name')->nullable()->after('emergency_contact_number');
            }
            if (!Schema::hasColumn('students', 'father_name')) {
                $table->string('father_name')->nullable()->after('mother_name');
            }
            if (!Schema::hasColumn('students', 'guardian_name')) {
                $table->string('guardian_name')->nullable()->after('father_name');
            }

            // Add personal information fields
            if (!Schema::hasColumn('students', 'gender')) {
                $table->enum('gender', ['male', 'female', 'other'])->nullable()->after('guardian_name');
            }
            if (!Schema::hasColumn('students', 'birthday')) {
                $table->date('birthday')->nullable()->after('gender');
            }
            if (!Schema::hasColumn('students', 'birthplace')) {
                $table->string('birthplace')->nullable()->after('birthday');
            }
            if (!Schema::hasColumn('students', 'religion')) {
                $table->string('religion')->nullable()->after('birthplace');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn([
                'semester',
                'mother_name',
                'father_name',
                'guardian_name',
                'gender',
                'birthday',
                'birthplace',
                'religion'
            ]);
        });
    }
};

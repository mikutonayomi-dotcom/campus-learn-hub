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
            // Add semester field
            $table->enum('semester', ['1st', '2nd'])->nullable()->after('year_level');
            
            // Add family information fields
            $table->string('mother_name')->nullable()->after('emergency_contact_number');
            $table->string('father_name')->nullable()->after('mother_name');
            $table->string('guardian_name')->nullable()->after('father_name');
            
            // Add personal information fields
            $table->enum('gender', ['male', 'female', 'other'])->nullable()->after('guardian_name');
            $table->date('birthday')->nullable()->after('gender');
            $table->string('birthplace')->nullable()->after('birthday');
            $table->string('religion')->nullable()->after('birthplace');
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

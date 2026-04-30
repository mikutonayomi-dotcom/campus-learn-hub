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
            // Add employment status
            $table->enum('employment_status', ['Full-time', 'Part-time'])->default('Full-time')->after('position');
            
            // Add educational attainment
            $table->string('educational_attainment')->nullable()->after('specialization');
            
            // Add family information fields
            $table->string('mother_name')->nullable()->after('office_location');
            $table->string('father_name')->nullable()->after('mother_name');
            
            // Add personal information fields
            $table->enum('gender', ['male', 'female', 'other'])->nullable()->after('father_name');
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

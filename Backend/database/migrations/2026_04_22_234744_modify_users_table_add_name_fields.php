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
        Schema::table('users', function (Blueprint $table) {
            // Add new name fields
            $table->string('first_name')->after('id');
            $table->string('middle_name')->nullable()->after('first_name');
            $table->string('last_name')->after('middle_name');
            $table->string('suffix')->nullable()->after('last_name');
            
            // Add personal information fields
            $table->string('contact_number')->nullable()->after('email');
            $table->text('address')->nullable()->after('contact_number');
            $table->enum('gender', ['male', 'female', 'other'])->nullable()->after('address');
            $table->date('birthday')->nullable()->after('gender');
            $table->string('birthplace')->nullable()->after('birthday');
            $table->string('religion')->nullable()->after('birthplace');
            $table->string('mother_name')->nullable()->after('religion');
            $table->string('father_name')->nullable()->after('mother_name');
            $table->string('guardian_name')->nullable()->after('father_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'first_name',
                'middle_name',
                'last_name',
                'suffix',
                'contact_number',
                'address',
                'gender',
                'birthday',
                'birthplace',
                'religion',
                'mother_name',
                'father_name',
                'guardian_name'
            ]);
        });
    }
};

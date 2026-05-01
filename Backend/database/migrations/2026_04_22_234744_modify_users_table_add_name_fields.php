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
            // Add new name fields (skip if already exist from base migration)
            if (!Schema::hasColumn('users', 'first_name')) {
                $table->string('first_name')->after('id');
            }
            if (!Schema::hasColumn('users', 'middle_name')) {
                $table->string('middle_name')->nullable()->after('first_name');
            }
            if (!Schema::hasColumn('users', 'last_name')) {
                $table->string('last_name')->after('middle_name');
            }
            if (!Schema::hasColumn('users', 'suffix')) {
                $table->string('suffix')->nullable()->after('last_name');
            }

            // Add personal information fields
            if (!Schema::hasColumn('users', 'contact_number')) {
                $table->string('contact_number')->nullable()->after('email');
            }
            if (!Schema::hasColumn('users', 'address')) {
                $table->text('address')->nullable()->after('contact_number');
            }
            if (!Schema::hasColumn('users', 'gender')) {
                $table->enum('gender', ['male', 'female', 'other'])->nullable()->after('address');
            }
            if (!Schema::hasColumn('users', 'birthday')) {
                $table->date('birthday')->nullable()->after('gender');
            }
            if (!Schema::hasColumn('users', 'birthplace')) {
                $table->string('birthplace')->nullable()->after('birthday');
            }
            if (!Schema::hasColumn('users', 'religion')) {
                $table->string('religion')->nullable()->after('birthplace');
            }
            if (!Schema::hasColumn('users', 'mother_name')) {
                $table->string('mother_name')->nullable()->after('religion');
            }
            if (!Schema::hasColumn('users', 'father_name')) {
                $table->string('father_name')->nullable()->after('mother_name');
            }
            if (!Schema::hasColumn('users', 'guardian_name')) {
                $table->string('guardian_name')->nullable()->after('father_name');
            }
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

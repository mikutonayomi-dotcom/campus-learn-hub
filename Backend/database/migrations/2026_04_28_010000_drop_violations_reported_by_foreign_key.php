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
        Schema::table('violations', function (Blueprint $table) {
            try {
                $table->dropForeign('violations_reported_by_foreign');
            } catch (\Exception $e) {
                // Foreign key may not exist; continue
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('violations', function (Blueprint $table) {
            $table->foreign('reported_by')->references('id')->on('faculty')->onDelete('cascade');
        });
    }
};

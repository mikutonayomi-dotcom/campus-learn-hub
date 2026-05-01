<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('violations', function (Blueprint $table) {
            $table->foreignId('reported_by')->nullable()->after('student_id');
            $table->string('reporter_type')->nullable()->after('reported_by');
            $table->foreignId('approved_by')->nullable()->after('status');
            $table->timestamp('approved_at')->nullable()->after('approved_by');
            $table->text('admin_remarks')->nullable()->after('remarks');
            $table->date('violation_date')->nullable()->after('date');
            $table->string('evidence_path')->nullable()->after('violation_date');
            $table->string('type')->nullable()->after('violation_type_id');
            
            // Add indexes
            $table->index(['reported_by', 'reporter_type']);
            $table->index('status');
            $table->index('severity');
        });
    }

    public function down(): void
    {
        Schema::table('violations', function (Blueprint $table) {
            $table->dropForeign(['reported_by']);
            $table->dropColumn(['reported_by', 'reporter_type', 'approved_by', 'approved_at', 'admin_remarks', 'violation_date', 'evidence_path', 'type']);
        });
    }
};

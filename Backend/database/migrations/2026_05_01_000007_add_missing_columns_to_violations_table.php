<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('violations', function (Blueprint $table) {
            if (!Schema::hasColumn('violations', 'reported_by')) {
                $table->foreignId('reported_by')->nullable()->after('student_id');
            }
            if (!Schema::hasColumn('violations', 'reporter_type')) {
                $table->string('reporter_type')->nullable()->after('reported_by');
            }
            if (!Schema::hasColumn('violations', 'approved_by')) {
                $table->foreignId('approved_by')->nullable()->after('status');
            }
            if (!Schema::hasColumn('violations', 'approved_at')) {
                $table->timestamp('approved_at')->nullable()->after('approved_by');
            }
            if (!Schema::hasColumn('violations', 'admin_remarks')) {
                $table->text('admin_remarks')->nullable()->after('remarks');
            }
            if (!Schema::hasColumn('violations', 'violation_date')) {
                $table->date('violation_date')->nullable()->after('date');
            }
            if (!Schema::hasColumn('violations', 'evidence_path')) {
                $table->string('evidence_path')->nullable()->after('violation_date');
            }
            if (!Schema::hasColumn('violations', 'type')) {
                $table->string('type')->nullable()->after('violation_type_id');
            }
        });

        Schema::table('violations', function (Blueprint $table) {
            $sm = Schema::getConnection()->getDoctrineSchemaManager();
            $indexes = collect($sm->listTableIndexes('violations'))->keys()->toArray();

            if (!in_array('violations_reported_by_reporter_type_index', $indexes)) {
                $table->index(['reported_by', 'reporter_type']);
            }
            if (!in_array('violations_status_index', $indexes)) {
                $table->index('status');
            }
            if (!in_array('violations_severity_index', $indexes)) {
                $table->index('severity');
            }
        });
    }

    public function down(): void
    {
        Schema::table('violations', function (Blueprint $table) {
            $table->dropIndex(['reported_by', 'reporter_type']);
            $table->dropIndex(['status']);
            $table->dropIndex(['severity']);
            $table->dropColumn(['reported_by', 'reporter_type', 'approved_by', 'approved_at', 'admin_remarks', 'violation_date', 'evidence_path', 'type']);
        });
    }
};

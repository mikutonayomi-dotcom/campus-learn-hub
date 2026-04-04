<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $query = ActivityLog::with('user');

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('action')) {
            $query->where('action', $request->action);
        }

        if ($request->has('entity_type')) {
            $query->where('entity_type', $request->entity_type);
        }

        if ($request->has('date_from') && $request->has('date_to')) {
            $query->whereBetween('created_at', [$request->date_from, $request->date_to]);
        }

        $perPage = $request->input('per_page', 50);
        return response()->json($query->orderBy('created_at', 'desc')->paginate($perPage));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'action' => 'required|string',
            'entity_type' => 'nullable|string',
            'entity_id' => 'nullable|integer',
            'description' => 'required|string',
        ]);

        $log = ActivityLog::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json($log->load('user'), 201);
    }

    public function myLogs(Request $request)
    {
        $logs = ActivityLog::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->take(100)
            ->get();

        return response()->json($logs);
    }

    public function studentLogs(Request $request)
    {
        $studentIds = \App\Models\Student::pluck('user_id');
        
        $logs = ActivityLog::with('user')
            ->whereIn('user_id', $studentIds)
            ->orderBy('created_at', 'desc')
            ->take(100)
            ->get();

        return response()->json($logs);
    }

    public function facultyLogs(Request $request)
    {
        $facultyIds = \App\Models\Faculty::pluck('user_id');
        
        $logs = ActivityLog::with('user')
            ->whereIn('user_id', $facultyIds)
            ->orderBy('created_at', 'desc')
            ->take(100)
            ->get();

        return response()->json($logs);
    }
}

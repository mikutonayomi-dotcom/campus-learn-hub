<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notifications);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string',
            'message' => 'required|string',
            'type' => 'required|string',
            'link' => 'nullable|string',
        ]);

        $notification = Notification::create($validated);
        return response()->json($notification, 201);
    }

    public function show(Notification $notification)
    {
        // Mark as read when viewed
        if (!$notification->is_read) {
            $notification->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
        }

        return response()->json($notification);
    }

    public function markAsRead(Notification $notification)
    {
        $notification->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return response()->json(['message' => 'Notification marked as read']);
    }

    public function markAllAsRead(Request $request)
    {
        Notification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return response()->json(['message' => 'All notifications marked as read']);
    }

    public function unreadCount(Request $request)
    {
        $count = Notification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->count();

        return response()->json(['count' => $count]);
    }

    public function destroy(Notification $notification)
    {
        $notification->delete();
        return response()->json(['message' => 'Notification deleted successfully']);
    }

    public function broadcast(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'message' => 'required|string',
            'type' => 'required|string',
            'link' => 'nullable|string',
            'target' => 'required|in:all,students,faculty,admins',
        ]);

        $userIds = [];
        
        switch ($validated['target']) {
            case 'all':
                $userIds = \App\Models\User::pluck('id');
                break;
            case 'students':
                $userIds = \App\Models\Student::pluck('user_id');
                break;
            case 'faculty':
                $userIds = \App\Models\Faculty::pluck('user_id');
                break;
            case 'admins':
                $userIds = \App\Models\User::where('role', 'admin')->pluck('id');
                break;
        }

        $notifications = [];
        foreach ($userIds as $userId) {
            $notifications[] = Notification::create([
                'user_id' => $userId,
                'title' => $validated['title'],
                'message' => $validated['message'],
                'type' => $validated['type'],
                'link' => $validated['link'] ?? null,
            ]);
        }

        return response()->json([
            'message' => 'Notification broadcasted successfully',
            'count' => count($notifications),
        ]);
    }
}

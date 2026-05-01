<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index()
    {
        $rooms = Room::withCount('schedules')->get();
        return response()->json($rooms);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'type' => 'required|in:classroom,lab,gym,auditorium',
            'capacity' => 'required|integer|min:1',
        ]);

        $room = Room::create($validated);
        return response()->json($room, 201);
    }

    public function show(Room $room)
    {
        return response()->json($room->load(['schedules.subject', 'schedules.section']));
    }

    public function update(Request $request, Room $room)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'type' => 'sometimes|in:classroom,lab,gym,auditorium',
            'capacity' => 'sometimes|integer|min:1',
        ]);

        $room->update($validated);
        return response()->json($room);
    }

    public function destroy(Room $room)
    {
        $room->delete();
        return response()->json(['message' => 'Room deleted successfully']);
    }

    public function availability(Room $room, Request $request)
    {
        $request->validate([
            'day' => 'required|in:monday,tuesday,wednesday,thursday,friday,saturday',
            'date' => 'required|date',
        ]);

        $schedules = $room->schedules()
            ->where('day', $request->day)
            ->get();

        return response()->json([
            'room' => $room,
            'schedules' => $schedules,
        ]);
    }
}

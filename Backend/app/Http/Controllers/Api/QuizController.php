<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\QuizAttempt;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    public function index(Request $request)
    {
        $query = Quiz::with(['subject', 'faculty.user', 'questions']);

        if ($request->user()->isFaculty()) {
            $query->where('faculty_id', $request->user()->faculty->id);
        }

        if ($request->has('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }

        if ($request->has('is_published')) {
            $query->where('is_published', $request->boolean('is_published'));
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration_minutes' => 'required|integer|min:1',
            'total_points' => 'required|integer|min:1',
            'passing_score' => 'required|integer|min:0|max:total_points',
            'start_time' => 'nullable|date',
            'end_time' => 'nullable|date|after:start_time',
            'is_published' => 'sometimes|boolean',
            'allow_retake' => 'sometimes|boolean',
        ]);

        $validated['faculty_id'] = $request->user()->faculty->id;
        $validated['is_published'] = $validated['is_published'] ?? false;
        $validated['allow_retake'] = $validated['allow_retake'] ?? false;

        $quiz = Quiz::create($validated);

        return response()->json($quiz->load(['subject', 'faculty.user']), 201);
    }

    public function show(Quiz $quiz)
    {
        if (request()->user()->isStudent()) {
            // Students only see published quizzes
            if (!$quiz->is_published) {
                return response()->json(['message' => 'Quiz not published'], 403);
            }
            // Don't show correct answers to students
            $quiz->load(['subject', 'faculty.user', 'questions' => function ($q) {
                $q->select('id', 'quiz_id', 'question', 'question_type', 'points', 'options', 'order');
            }]);
        } else {
            $quiz->load(['subject', 'faculty.user', 'questions']);
        }

        return response()->json($quiz);
    }

    public function update(Request $request, Quiz $quiz)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'duration_minutes' => 'sometimes|integer|min:1',
            'total_points' => 'sometimes|integer|min:1',
            'passing_score' => 'sometimes|integer|min:0|max:total_points',
            'start_time' => 'nullable|date',
            'end_time' => 'nullable|date|after:start_time',
            'is_published' => 'sometimes|boolean',
            'allow_retake' => 'sometimes|boolean',
        ]);

        $quiz->update($validated);

        return response()->json($quiz->load(['subject', 'faculty.user']));
    }

    public function destroy(Quiz $quiz)
    {
        $quiz->delete();
        return response()->json(['message' => 'Quiz deleted successfully']);
    }

    public function addQuestion(Request $request, Quiz $quiz)
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'question_type' => 'required|in:multiple_choice,true_false,short_answer,essay',
            'points' => 'required|integer|min:1',
            'options' => 'nullable|array',
            'correct_answer' => 'required|string',
            'explanation' => 'nullable|string',
            'order' => 'required|integer|min:0',
        ]);

        $validated['quiz_id'] = $quiz->id;

        $question = QuizQuestion::create($validated);

        return response()->json($question, 201);
    }

    public function updateQuestion(Request $request, QuizQuestion $question)
    {
        $validated = $request->validate([
            'question' => 'sometimes|string',
            'question_type' => 'sometimes|in:multiple_choice,true_false,short_answer,essay',
            'points' => 'sometimes|integer|min:1',
            'options' => 'nullable|array',
            'correct_answer' => 'sometimes|string',
            'explanation' => 'nullable|string',
            'order' => 'sometimes|integer|min:0',
        ]);

        $question->update($validated);

        return response()->json($question);
    }

    public function deleteQuestion(QuizQuestion $question)
    {
        $question->delete();
        return response()->json(['message' => 'Question deleted successfully']);
    }

    public function startQuiz(Request $request, Quiz $quiz)
    {
        $student = $request->user()->student;

        if (!$student) {
            return response()->json(['message' => 'Student profile not found'], 404);
        }

        if (!$quiz->is_published) {
            return response()->json(['message' => 'Quiz not published'], 403);
        }

        // Check if quiz is within time window
        if ($quiz->start_time && now()->lt($quiz->start_time)) {
            return response()->json(['message' => 'Quiz not yet started'], 403);
        }

        if ($quiz->end_time && now()->gt($quiz->end_time)) {
            return response()->json(['message' => 'Quiz has ended'], 403);
        }

        // Check if student already has an active attempt
        $existingAttempt = QuizAttempt::where('quiz_id', $quiz->id)
            ->where('student_id', $student->id)
            ->whereNull('completed_at')
            ->first();

        if ($existingAttempt) {
            return response()->json($existingAttempt);
        }

        // Check if retake is allowed
        if (!$quiz->allow_retake) {
            $completedAttempt = QuizAttempt::where('quiz_id', $quiz->id)
                ->where('student_id', $student->id)
                ->whereNotNull('completed_at')
                ->first();

            if ($completedAttempt) {
                return response()->json(['message' => 'Quiz already completed'], 403);
            }
        }

        $attempt = QuizAttempt::create([
            'quiz_id' => $quiz->id,
            'student_id' => $student->id,
            'started_at' => now(),
        ]);

        return response()->json($attempt, 201);
    }

    public function submitQuiz(Request $request, Quiz $quiz)
    {
        $validated = $request->validate([
            'answers' => 'required|array',
        ]);

        $student = $request->user()->student;

        $attempt = QuizAttempt::where('quiz_id', $quiz->id)
            ->where('student_id', $student->id)
            ->whereNull('completed_at')
            ->first();

        if (!$attempt) {
            return response()->json(['message' => 'No active quiz attempt found'], 404);
        }

        // Calculate score
        $score = 0;
        $totalPoints = 0;
        $questions = $quiz->questions;

        foreach ($questions as $question) {
            $totalPoints += $question->points;
            $studentAnswer = $validated['answers'][$question->id] ?? null;

            if ($question->question_type === 'multiple_choice' || $question->question_type === 'true_false') {
                if ($studentAnswer === $question->correct_answer) {
                    $score += $question->points;
                }
            }
        }

        $attempt->update([
            'completed_at' => now(),
            'score' => $score,
            'total_points' => $totalPoints,
            'is_passed' => $score >= $quiz->passing_score,
            'answers' => $validated['answers'],
        ]);

        return response()->json($attempt->load('quiz'));
    }

    public function myAttempts(Request $request)
    {
        $student = $request->user()->student;

        if (!$student) {
            return response()->json([]);
        }

        $attempts = QuizAttempt::where('student_id', $student->id)
            ->with('quiz.subject')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($attempts);
    }
}

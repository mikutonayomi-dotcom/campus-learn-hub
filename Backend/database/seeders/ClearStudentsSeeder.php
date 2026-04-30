<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Student;

class ClearStudentsSeeder extends Seeder
{
    public function run(): void
    {
        // Get all student users
        $studentUsers = User::where('role', 'student')->get();
        
        $count = 0;
        foreach ($studentUsers as $user) {
            // Delete student profile first (foreign key constraint)
            Student::where('user_id', $user->id)->delete();
            // Then delete user
            $user->delete();
            $count++;
        }

        $this->command->info('Cleared ' . $count . ' student users and profiles.');
    }
}

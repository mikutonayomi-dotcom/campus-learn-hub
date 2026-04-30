<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Schedule;

class ClearSchedulesSeeder extends Seeder
{
    public function run(): void
    {
        $count = Schedule::count();
        Schedule::query()->delete();
        $this->command->info('Cleared ' . $count . ' schedules.');
    }
}

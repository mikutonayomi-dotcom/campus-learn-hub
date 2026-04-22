<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Subject;
use Illuminate\Support\Facades\DB;

class UpdateSubjectsSemesterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Set default semester for all subjects to 1st
        DB::table('subjects')->update(['semester' => '1st']);
        
        $this->command->info('Updated all subjects semester to 1st');
    }
}

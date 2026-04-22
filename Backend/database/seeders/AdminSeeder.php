<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@campus.edu'],
            [
                'name' => 'Admin User',
                'email' => 'admin@campus.edu',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );
    }
}

<?php

namespace Database\Seeders;

use App\Enums\EUserRole;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Não utilizo o factory aqui, pois quero criar dois usuários padrões e não vários aleatórios
        DB::table('users')->insert([
            [
                'name' => __("seed.users.admin.name"),
                'username' => 'admin',
                'email' => 'admin@admin.com',
                'password' => Hash::make('p@ass'),
                'role' => EUserRole::ADMIN,
                'created_at' => now()
            ],
            [
                'name' => __("seed.users.user.name"),
                'username' => 'user',
                'email' => 'user@user.com',
                'password' => Hash::make('password'),
                'role' => EUserRole::USER,
                'created_at' => now()
            ]
        ]);
    }
}

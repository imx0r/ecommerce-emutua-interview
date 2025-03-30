<?php

namespace Database\Seeders;

use App\Enums\EProductCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 5 produtos aleatórios
        for ($i = 1; $i <= 5; $i++) {
            $category_id = DB::table('product_categories')->select('id')->inRandomOrder()->first()->id;
            DB::table('products')->insert([
                'name' => ucfirst(fake()->word()),
                'description' => fake()->text(),
                'price' => fake()->numberBetween(100, 1000),
                'category_id' => $category_id,
            ]);
        }
    }
}

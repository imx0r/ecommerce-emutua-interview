<?php

namespace Database\Seeders;

use App\Enums\EProductCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (EProductCategory::cases() as $category) {
            DB::table('product_categories')->insert([
                'name' => $category->value
            ]);
        }
    }
}

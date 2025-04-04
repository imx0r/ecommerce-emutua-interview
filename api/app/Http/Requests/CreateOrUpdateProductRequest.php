<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;

class CreateOrUpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return collect([
            'name' => ['string', 'max:255'],
            'description' => ['string', 'max:255'],
            'price' => ['numeric'],
            'image_url' => ['string'],
            'category' => ['exists:product_categories,id'],
        ])->when($this->isMethod('POST'), function ($collection) {
            return $collection->mapWithKeys(function ($rules, $field) {
                return [$field => array_merge(['required'], $rules)];
            });
        })->all();
    }
}

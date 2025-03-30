<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
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
        return [
            'name' => [
                Rule::requiredIf($this->method() == 'POST'),
                'string',
                'max:255',
            ],
            'description' => [
                Rule::requiredIf($this->method() == 'POST'),
                'string',
                'max:255'
            ],
            'price' => [
                Rule::requiredIf($this->method() == 'POST'),
                'numeric'
            ],
            'category' => [
                Rule::requiredIf($this->method() == 'POST'),
                'exists:product_categories,id'
            ],
        ];
    }
}

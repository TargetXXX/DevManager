<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SearchNivelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Mensagens customizadas.
     */
    public function messages(): array
    {
        return [
            'nivel.max' => 'O nivel pode ter no máximo 255 caracteres.',
        ];
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nivel' => 'sometimes|string|max:255',
            'per_page' => 'sometimes|integer|min:1|max:25',
        ];
    }
}

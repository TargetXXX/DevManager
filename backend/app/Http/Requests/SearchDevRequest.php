<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SearchDevRequest extends FormRequest
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
            'nivel_id.exists' => 'O nivel informado não existe.',
            'sexo.in' => 'Sexo inválido. Use apenas "M" ou "F".',
            'nome.max' => 'O nome pode ter no máximo 255 caracteres.',
            'email.email' => 'Email invalido.',
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
            'sexo' => 'sometimes|in:M,F',
            'nivel_id' => 'sometimes|exists:niveis,id',
            'nome' => 'sometimes|string|max:255',
            'per_page' => 'sometimes|integer|min:1|max:25',
            'email' => 'sometimes|string|max:255',
        ];
    }
}

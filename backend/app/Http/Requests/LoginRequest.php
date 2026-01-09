<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
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
            'required' => 'Preencha todos os campos.',
            'senha.min' => 'A senha deve ter no minimo 8 caracteres.',
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
            'email' => 'required|string|email|max:255',
            'senha' => 'required|string|min:8',
        ];
    }
}

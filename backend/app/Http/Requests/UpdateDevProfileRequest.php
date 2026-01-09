<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDevProfileRequest extends FormRequest
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
            'sexo.in' => 'Sexo inválido. Use apenas "M" ou "F".',
            'required' => 'Preencha todos os campos.',
            'email.email' => 'Email invalido.',
            'email.unique' => 'O email já está em uso por outro desenvolvedor.',
            'senha.min' => 'A senha deve ter no minimo 8 caracteres.',
            'senha.confirmed' => 'A confirmação da senha não confere.',
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
            'nome' => 'sometimes|required|string|max:255',
            'sexo' => 'sometimes|required|in:M,F',
            'data_nascimento' => 'sometimes|required|date',
            'hobby' => 'sometimes|required|string|max:255',
            'avatar' => 'sometimes|nullable|string',
            'email' => 'sometimes|required|string|email|max:255|unique:devs,email',
            'senha' => 'sometimes|required|string|min:8|confirmed',
            'senha_atual' => 'required|string|min:8',
        ];
    }
}

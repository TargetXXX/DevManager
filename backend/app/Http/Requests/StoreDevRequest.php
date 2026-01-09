<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDevRequest extends FormRequest
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
            'required' => 'Preencha todos os campos.',
            'sexo.in' => 'Sexo inválido. Use apenas "M" ou "F".',
            'email.email' => 'Email invalido.',
            'email.unique' => 'O email já está em uso por outro desenvolvedor.',
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
            'nome' => 'required|string|max:255',
            'sexo' => 'required|in:M,F',
            'data_nascimento' => 'required|date',
            'hobby' => 'required|string|max:255',
            'nivel_id' => 'required|integer|exists:niveis,id',
            'avatar' => 'sometimes|nullable|string',
            'email' => 'required|string|email|max:255|unique:devs,email',

        ];
    }
}

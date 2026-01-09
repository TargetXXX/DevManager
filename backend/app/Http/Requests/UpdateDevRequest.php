<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDevRequest extends FormRequest
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
            'required' => 'Preencha todos os campos.',
            'email.email' => 'Email invalido.',
            'email.unique' => 'O email já está em uso por outro desenvolvedor.',
            'nova_senha.min' => 'A senha deve ter no minimo 8 caracteres.',
            'nova_senha.confirmed' => 'A confirmação da senha não confere.',
        ];
    }


    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */



    public function rules(): array
    {
        $dev = $this->route('desenvolvedore') ?? $this->route('dev') ?? $this->route('desenvolvedores') ?? $this->route('id');
        $devId = $dev instanceof \App\Models\Dev ? $dev->id : $dev;

        return [
            'nome' => 'sometimes|required|string|max:255',
            'sexo' => 'sometimes|required|in:M,F',
            'data_nascimento' => 'sometimes|required|date',
            'hobby' => 'sometimes|required|string|max:255',
            'nivel_id' => 'sometimes|required|exists:niveis,id',
            'avatar' => 'sometimes|nullable|string',
            Rule::unique('devs', 'email')->ignore($devId),
            'senha' => 'sometimes|required|string|min:8|confirmed',
        ];
    }
}

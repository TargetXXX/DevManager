<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DevResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'sexo' => $this->sexo,
            'data_nascimento' => $this->data_nascimento,
            'email' => $this->email,
            'avatar' => $this->avatar,
            'idade' => floor(now()->diffInYears($this->data_nascimento, true)),
            'hobby' => $this->hobby,
            'nivel' => new NivelResource($this->whenLoaded('nivel')),
            'first_login' => $this->first_login,
        ];
    }
}

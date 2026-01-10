<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NivelResource extends JsonResource
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
            'nivel' => $this->nivel,
            'devs_count' => $this->whenCounted('devs', function () {
                return $this->devs->count();
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'permissions' => $this->getPermissions(),
        ];
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Dev extends Model
{
    /** @use HasFactory<\Database\Factories\DevFactory> */
    use HasFactory, HasApiTokens, Notifiable;

    protected $fillable = ['nivel_id', 'nome', 'sexo', 'data_nascimento', 'hobby', 'avatar', 'email', 'senha', 'first_login'];

    protected $hidden = ['senha', 'remember_token'];

    protected $casts = ['data_nascimento' => 'date', 'first_login' => 'boolean'];

    /**
     * Relação com o modelo Nivel.
     */

    public function nivel(): BelongsTo
    {
        return $this->belongsTo(Nivel::class, 'nivel_id');
    }

    public function hasPermission(string $permission): bool
    {
        return $this->nivel->hasPermission($permission);
    }

}

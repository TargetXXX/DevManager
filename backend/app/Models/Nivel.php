<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Nivel extends Model
{
    use HasFactory;

    protected $table = 'niveis';

    protected $fillable = ['nivel', 'permissions'];

    /**
     * Um nivel pode ter muitos desenvolvedores.
     */
    public function devs()
    {
        return $this->hasMany(Dev::class, 'nivel_id');
    }

    public function hasPermission(string $permission): bool
    {
        if (is_null($this->permissions))
            return false;

        $permissionsArray = explode(';', $this->permissions);
        return in_array(strtolower($permission), $permissionsArray, true);
    }

    public function addPermission(string $permission): void
    {
        $permissionsArray = is_null($this->permissions) ? [] : explode(';', $this->permissions);

        if (!in_array(strtolower($permission), $permissionsArray, true)) {
            $permissionsArray[] = strtolower($permission);
            $this->permissions = implode(';', $permissionsArray);
            $this->save();
        }
    }

    public function removePermission(string $permission): void
    {
        if (is_null($this->permissions))
            return;

        $permissionsArray = explode(';', $this->permissions);
        $updatedPermissions = array_filter($permissionsArray, fn($perm): bool => $perm !== strtolower($permission));

        $this->permissions = implode(';', $updatedPermissions);
        $this->save();
    }

    public function getPermissions(): array
    {
        if (is_null($this->permissions))
            return [];

        return explode(';', $this->permissions);
    }
}

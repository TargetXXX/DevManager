<?php

namespace App\Enum;

enum Permission: string
{
    case CREATE = 'create';
    case READ = 'read';
    case UPDATE = 'update';
    case DELETE = 'delete';
    public static function values(): array
    {
        return array_map(fn(self $permission) => $permission->value, self::cases());
    }
}

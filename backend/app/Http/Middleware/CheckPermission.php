<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = $request->user();

        $perms = explode(';', $permission);

        foreach ($perms as $perm) {
            if ($user && $user->hasPermission($perm)) {
                return $next($request);
                ;
            }
        }

        abort(403, 'Sem permissao.');

    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Resources\DevResource;
use App\Http\Resources\NivelResource;
use App\Models\Dev;
use App\Models\Nivel;
use Hash;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class DashboardController extends Controller
{
    public function dashboardStats(Request $request): JsonResponse
    {

        $devCount = Dev::count();

        $niveisCount = Nivel::count();

        $nivelComMaisDevs = Nivel::withCount('devs')->orderBy('devs_count', 'desc')->first();

        $ultimo_dev = Dev::latest()->first();

        $ultimo_nivel = Nivel::latest()->first();

        return response()->json([
            'total_devs' => $devCount,
            'total_niveis' => $niveisCount,
            'nivel_com_mais_devs' => $nivelComMaisDevs ? new NivelResource($nivelComMaisDevs) : null,
            'ultimo_dev' => $ultimo_dev ? new DevResource($ultimo_dev) : null,
            'ultimo_nivel' => $ultimo_nivel ? new NivelResource($ultimo_nivel) : null,
        ]);
    }


}

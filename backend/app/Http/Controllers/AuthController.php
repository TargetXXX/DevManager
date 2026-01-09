<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Resources\DevResource;
use App\Models\Dev;
use Hash;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {

        $data = $request->validated();
        $dev = Dev::where('email', $data['email'])->first();

        if (!$dev || !Hash::check($data['senha'], $dev->senha)) {
            throw ValidationException::withMessages(['email' => ['Credenciais inválidas.']]);
        }

        $dev->tokens()->delete();
        $token = $dev->createToken('api')->plainTextToken;

        return response()->json([
            'token' => $token,
            'first_login' => $dev->first_login,
            'dev' => new DevResource($dev->load('nivel')),
        ]);
    }

    public function isExpired(Request $request)
    {
        $token = $request['token'] ?? null;

        $dev = $request->user();


        if (!$token || !$dev)
            return response()->json([
                'message' => 'Token invalido',
                'code' => 'A'
            ], 404);

        return response()->json([
            'message' => 'Token valido',
            'code' => 'B'
        ]);

    }

    public function me(Request $request)
    {
        $dev = $request->user()->load('nivel');

        return response()->json([
            'dev' => $dev,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->noContent();
    }

    public function changePassword(Request $request)
    {
        $data = $request->validate([
            'senha_atual' => ['required', 'string'],
            'nova_senha' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $dev = $request->user();

        if (!Hash::check($data['senha_atual'], $dev->senha)) {
            return response()->json([
                'error' => 'Senha atual invalida.'
            ], 400);
        }

        $dev->senha = Hash::make($data['nova_senha']);
        $dev->first_login = false;
        $dev->save();

        return response()->json([
            'message' => 'Senha alterada com sucesso.',
            'data' => new DevResource($dev->load('nivel'))
        ]);
    }
}

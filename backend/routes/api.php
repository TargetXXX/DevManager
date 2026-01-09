<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DevController;
use App\Http\Controllers\NivelController;
use App\Enum\Permission;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/changepassword', [AuthController::class, 'changePassword']);
    Route::put('/editProfile', [DevController::class, 'updateProfile']);
    Route::apiResource('niveis', NivelController::class);
    Route::apiResource('desenvolvedores', DevController::class);
    Route::post('/auth/checktoken', [AuthController::class, 'isExpired']);
});

Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/permissions', function (): array {
    return Permission::values();
});
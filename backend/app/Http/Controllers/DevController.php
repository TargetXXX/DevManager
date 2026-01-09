<?php

namespace App\Http\Controllers;

use App\Http\Requests\SearchDevRequest;
use App\Http\Requests\StoreDevRequest;
use App\Http\Requests\UpdateDevProfileRequest;
use App\Http\Requests\UpdateDevRequest;
use App\Http\Resources\DevResource;
use App\Models\Dev;
use Hash;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class DevController extends Controller
{


    public function __construct()
    {
        $actionPerm = ['index' => 'read', 'store' => 'create', 'update' => 'update', 'destroy' => 'delete'];

        foreach ($actionPerm as $action => $permission) {
            $this->middleware(['auth:sanctum', "CheckPermission:$permission"])->only($action);
        }
    }

    /**
     * Listar devs existentes com possiblidade de busca via query string e paginacao.
     */
    public function index(SearchDevRequest $request): AnonymousResourceCollection|JsonResponse
    {

        $perPage = (int) $request->query('per_page', 10);
        /**
         * Validação simples pra garantir que o perPage esta entre 1 e 25.
         */
        $perPage = max(1, min($perPage, 25));

        $devs = Dev::with('nivel')
            ->when($request->filled('sexo'), function ($query) use ($request) {
                $query->where('sexo', $request->input('sexo'));
            })
            ->when($request->filled('nivel_id'), function ($query) use ($request) {
                $query->whereIn('nivel_id', $request->input('nivel_id'));
            })
            ->when($request->filled('nome'), function ($query) use ($request) {
                $query->where('nome', 'like', '%' . $request->input('nome') . '%');
            })
            ->when($request->filled('hobby'), function ($query) use ($request) {
                $query->where('hobby', 'like', '%' . $request->input('hobby') . '%');
            })
            ->when($request->filled('email'), function ($query) use ($request) {
                $query->where('email', 'like', '%' . $request->input('email') . '%');
            })
            ->when($request->filled('order') || $request->filled('orderby'), function ($query) use ($request) {

                $sortBy = $request->input('orderby') ?? null;
                $sortOrder = $request->input('order') ?? null;

                $sortBy = is_string($sortBy) ? $sortBy : null;
                $sortOrder = is_string($sortOrder) ? strtolower($sortOrder) : null;

                $allowedSorts = ['nome', 'nivel_id', 'sexo', 'hobby', 'data_nascimento', 'email'];

                if ($sortBy === 'idade')
                    $sortBy = 'data_nascimento';

                if ($sortBy === 'data_nascimento')
                    $sortOrder = $sortOrder === 'asc' ? 'desc' : 'asc';

                if ($sortBy && in_array($sortBy, $allowedSorts, true) && in_array($sortOrder, ['asc', 'desc'], true)) {
                    $query->orderBy($sortBy, $sortOrder);
                }
            })
            ->paginate($perPage)
            ->appends($request->query());



        if ($devs->total() === 0 && $devs->currentPage() === 1) {
            return response()->json([], 404);
        }

        return DevResource::collection($devs);
    }

    /**
     * Cadastrar um novo dev.
     */
    public function store(StoreDevRequest $request): DevResource|JsonResponse
    {
        $defaultPassword = 'admin123';


        $data = $request->validated();

        if ($request->filled('avatar')) {
            $data['avatar'] = $request->input('avatar');
        }

        $data['senha'] = Hash::make($defaultPassword);

        $dev = Dev::create($data);
        return new DevResource($dev->load('nivel'));
    }

    /**
     * Atualizar um dev.
     */
    public function update(UpdateDevRequest $request, int $id): DevResource
    {

        $dev = Dev::findOrFail($id);
        $data = $request->validated();

        if ($request->filled('avatar')) {
            $data['avatar'] = $request->input('avatar');
        }

        $dev->update($data);

        return new DevResource($dev->load('nivel'));
    }

    /**
     * Atualizar o proprio perfil.
     */
    public function updateProfile(UpdateDevProfileRequest $request): DevResource|JsonResponse
    {
        $dev = $request->user();
        $data = $request->validated();

        if (!Hash::check($request->senha_atual, $dev->senha)) {
            return response()->json(['error' => 'Senha atual inválida'], 403);
        }

        if ($request->filled('avatar')) {
            $data['avatar'] = $request->input('avatar');
        }

        unset($data['senha_atual']);
        unset($data['senha_confirmation']);

        if (!empty($data['senha'])) {
            $data['senha'] = Hash::make($data['senha']);
        } else {
            unset($data['senha']);
        }

        $data = array_filter($data, fn($value) => !is_null($value) && $value !== '');

        $dev->update($data);

        return new DevResource($dev->load('nivel'));
    }

    /**
     * Deletar um dev.
     */
    public function destroy(int $id): JsonResponse|Response
    {
        $dev = Dev::find($id);

        if (!$dev)
            return response()->json(['error' => 'Desenvolvedor não encontrado'], 404);

        $dev->delete();

        return response()->noContent();
    }

}

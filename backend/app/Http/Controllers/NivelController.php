<?php

namespace App\Http\Controllers;

use App\Http\Requests\SearchNivelRequest;
use App\Http\Requests\StoreNivelRequest;
use App\Http\Requests\UpdateNivelRequest;
use App\Http\Resources\NivelResource;
use App\Models\Nivel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use function PHPUnit\Framework\isArray;

class NivelController extends Controller
{

    public function __construct()
    {
        $actionPerm = ['index' => 'read;create', 'store' => 'create', 'update' => 'update', 'destroy' => 'delete'];

        foreach ($actionPerm as $action => $permission) {
            $this->middleware(['auth:sanctum', "CheckPermission:$permission"])->only($action);
        }
    }


    /**
     * Lista os niveis já com paginacao e busca.
     */
    public function index(SearchNivelRequest $request): AnonymousResourceCollection|JsonResponse
    {

        $perPage = (int) $request->query('per_page', 10);
        /**
         * Validação simples pra garantir que o perPage esta entre 1 e 25.
         */
        $perPage = max(1, min($perPage, 25));

        $niveis = Nivel::withCount('devs')
            ->when($request->filled('nivel'), function ($query) use ($request) {
                $query->where('nivel', 'like', '%' . $request->input('nivel') . '%');
            })
            ->when($request->filled('order') || $request->filled('orderby'), function ($query) use ($request) {

                $sortBy = $request->input('orderby') ?? null;
                $sortOrder = $request->input('order') ?? null;

                $sortBy = is_string($sortBy) ? $sortBy : null;
                $sortOrder = is_string($sortOrder) ? strtolower($sortOrder) : null;

                $allowedSorts = ['nivel', 'created_at', 'devs_count', 'id'];

                if ($sortBy && in_array($sortBy, $allowedSorts, true) && in_array($sortOrder, ['asc', 'desc'], true)) {
                    $query->orderBy($sortBy, $sortOrder);
                }
            })
            ->paginate($perPage)
            ->appends($request->query());

        if ($niveis->total() === 0 && $niveis->currentPage() === 1) {
            return response()->json([], 404);
        }

        return NivelResource::collection($niveis);
    }

    /**
     * Cadastrar um novo nivel.
     */
    public function store(StoreNivelRequest $request): NivelResource
    {

        $data = $request->validated();

        $permissions = $data["permissions"];

        if ($permissions && isArray($permissions))
            $data["permissions"] = implode(';', $permissions);

        $nivel = Nivel::create($data);
        return new NivelResource($nivel);
    }

    /**
     * Atualizar um nivel já existente.
     */
    public function update(UpdateNivelRequest $request, int $id): NivelResource
    {
        $nivel = Nivel::findOrFail($id);

        $data = $request->validated();

        $permissions = $data["permissions"];

        if ($permissions && isArray($permissions))
            $data["permissions"] = implode(';', $permissions);

        $nivel->update($data);

        return new NivelResource($nivel);
    }

    /**
     * Deletar um nivel.
     */
    public function destroy(int $id): JsonResponse|Response
    {
        $nivel = Nivel::find($id);

        if (!$nivel)
            return response()->json(['error' => 'Nivel não encontrado'], 404);

        if ($nivel->devs()->exists()) {
            return response()->json([
                'error' => 'Existem desenvolvedores associados a este nível'
            ], 400);
        }

        $nivel->delete();
        return response()->noContent();
    }

}

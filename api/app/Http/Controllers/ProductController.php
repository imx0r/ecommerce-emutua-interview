<?php

namespace App\Http\Controllers;

use App\Enums\EResponseStatus;
use App\Exceptions\ProductException;
use App\Http\Requests\CreateOrUpdateProductRequest;
use App\Http\Requests\DeleteProductRequest;
use App\Service\OpenSearchService;
use App\Service\ProductService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class ProductController extends Controller
{
    private ProductService $products;

    private OpenSearchService $openSearchService;

    public function __construct(ProductService $products, OpenSearchService $openSearchService)
    {
        $this->products = $products;
        $this->openSearchService = $openSearchService;
    }

    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        $products = Cache::remember(config('cache.keys.product.products.key'), config('cache.keys.product.products.ttl'), function () {
            return $this->products->all();
        });
        return response()->json($products, HttpResponse::HTTP_OK);
    }

    public function show(Request $request, int $id): \Illuminate\Http\JsonResponse
    {
        $product = Cache::remember(Str::replace(':id', $id, config('cache.keys.product.product.key')), config('cache.keys.product.product.ttl'), function () use ($id) {
            return $this->products->byId($id);
        });
        return response()->json($product, HttpResponse::HTTP_OK);
    }

    public function store(CreateOrUpdateProductRequest $request): \Illuminate\Http\JsonResponse
    {
        if (!$this->userIsAdministrator()) {
            return response()->json(["status" => EResponseStatus::ERROR, "message" => __("product.create.forbidden")], HttpResponse::HTTP_FORBIDDEN);
        }

        try {
            $product = $this->products->createProduct($request->validated());
            if ($product) {
                $this->openSearchService->indexProduct($product->toArray());
            }
            return response()->json($product->toArray(), HttpResponse::HTTP_CREATED);
        } catch (ProductException $e) {
            return response()->json(["status" => EResponseStatus::FAILED, "message" => $e->getMessage()], HttpResponse::HTTP_BAD_REQUEST);
        }
    }

    public function update(CreateOrUpdateProductRequest $request, int $id): \Illuminate\Http\JsonResponse
    {
        if (!$this->userIsAdministrator()) {
            return response()->json(["status" => EResponseStatus::ERROR, "message" => __("product.update.forbidden")], HttpResponse::HTTP_FORBIDDEN);
        }

        try {
            $product = $this->products->updateProduct($this->products->byId($id), $request->validated());
            if ($product) {
                $this->openSearchService->indexProduct($product->toArray());
            }
            return response()->json($product->toArray(), HttpResponse::HTTP_OK);
        } catch (ProductException $e) {
            return response()->json(["status" => EResponseStatus::FAILED, "message" => $e->getMessage()], HttpResponse::HTTP_BAD_REQUEST);
        }
    }

    public function destroy(DeleteProductRequest $request, int $id): \Illuminate\Http\JsonResponse
    {
        if (!$this->userIsAdministrator()) {
            return response()->json(["status" => EResponseStatus::ERROR, "message" => __("product.delete.forbidden")], HttpResponse::HTTP_FORBIDDEN);
        }

        try {
            $product = $this->products->byId($id);
            $this->products->deleteProduct($product);
            $this->openSearchService->removeProduct($id);
            return response()->json(["status" => EResponseStatus::SUCCESS, "status_code" => HttpResponse::HTTP_OK, "message" => __("product.delete.success")], HttpResponse::HTTP_OK);
        } catch (ProductException $e) {
            return response()->json(["status" => EResponseStatus::FAILED, "message" => $e->getMessage()], HttpResponse::HTTP_BAD_REQUEST);
        }
    }

    private function userIsAdministrator(): bool
    {
        return request()->user()->isAdministrator();
    }
}

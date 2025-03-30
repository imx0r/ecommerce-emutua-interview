<?php

namespace App\Http\Controllers;

use App\Enums\EResponseStatus;
use App\Exceptions\ProductException;
use App\Http\Requests\CreateOrUpdateProductRequest;
use App\Http\Requests\DeleteProductRequest;
use App\Service\ProductService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class ProductController extends Controller
{
    private ProductService $products;

    public function __construct(ProductService $products)
    {
        $this->products = $products;
    }

    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        return response()->json($this->products->all(), HttpResponse::HTTP_OK);
    }

    public function show(Request $request, int $id): \Illuminate\Http\JsonResponse
    {
        try {
            return response()->json($this->products->byId($id)->toArray(), HttpResponse::HTTP_OK);
        } catch (ProductException $e) {
            return response()->json(["status" => EResponseStatus::FAILED, "message" => $e->getMessage()], HttpResponse::HTTP_BAD_REQUEST);
        }
    }

    public function store(CreateOrUpdateProductRequest $request): \Illuminate\Http\JsonResponse
    {
        if (!$request->user()->isAdministrator()) {
            return response()->json(["status" => EResponseStatus::ERROR, "message" => __("product.create.forbidden")], HttpResponse::HTTP_FORBIDDEN);
        }

        try {
            $product = $this->products->createProduct($request->validated());
            return response()->json($product->toArray(), HttpResponse::HTTP_CREATED);
        } catch (ProductException $e) {
            return response()->json(["status" => EResponseStatus::FAILED, "message" => $e->getMessage()], HttpResponse::HTTP_BAD_REQUEST);
        }
    }

    public function update(CreateOrUpdateProductRequest $request, int $id): \Illuminate\Http\JsonResponse
    {
        if (!$request->user()->isAdministrator()) {
            return response()->json(["status" => EResponseStatus::ERROR, "message" => __("product.update.forbidden")], HttpResponse::HTTP_FORBIDDEN);
        }

        try {
            $product = $this->products->byId($id);
            $product = $this->products->updateProduct($product, $request->validated());
            return response()->json($product->toArray(), HttpResponse::HTTP_OK);
        } catch (ProductException $e) {
            return response()->json(["status" => EResponseStatus::FAILED, "message" => $e->getMessage()], HttpResponse::HTTP_BAD_REQUEST);
        }
    }

    public function destroy(DeleteProductRequest $request, int $id): \Illuminate\Http\JsonResponse
    {
        if (!$request->user()->isAdministrator()) {
            return response()->json(["status" => EResponseStatus::ERROR, "message" => __("product.delete.forbidden")], HttpResponse::HTTP_FORBIDDEN);
        }

        try {
            $product = $this->products->byId($id);
            $this->products->deleteProduct($product);
            return response()->json(["status" => EResponseStatus::SUCCESS, "status_code" => HttpResponse::HTTP_OK, "message" => __("product.delete.success")], HttpResponse::HTTP_OK);
        } catch (ProductException $e) {
            return response()->json(["status" => EResponseStatus::FAILED, "message" => $e->getMessage()], HttpResponse::HTTP_BAD_REQUEST);
        }
    }
}

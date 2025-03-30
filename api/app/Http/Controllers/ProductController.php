<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateProductRequest;
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
        return response()->json($this->products->byId($id), HttpResponse::HTTP_OK);
    }

    public function store(CreateProductRequest $request): \Illuminate\Http\JsonResponse
    {
        $product = $this->products->createProduct($request->validated());
        return response()->json($product, HttpResponse::HTTP_CREATED);
    }

    public function update(Request $request, int $id): \Illuminate\Http\JsonResponse
    {
        $product = $this->products->byId($id);
        $product = $this->products->updateProduct($product, $request->validated());
        return response()->json($product, HttpResponse::HTTP_OK);
    }

    public function destroy(Request $request, int $id): \Illuminate\Http\JsonResponse
    {
        $product = $this->products->byId($id);
        $this->products->deleteProduct($product);
        return response()->json(["status" => "success", "status_code" => HttpResponse::HTTP_OK, "message" => __("product.deleted")], HttpResponse::HTTP_OK);
    }
}

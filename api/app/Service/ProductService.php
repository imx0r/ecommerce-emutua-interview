<?php

namespace App\Service;

use App\Entities\Product;
use App\Entities\ProductCategory;
use App\Exceptions\ProductException;
use App\Repositories\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Illuminate\Support\Collection;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class ProductService extends EntityService
{
    private EntityManagerInterface $em;
    private ProductRepository $repository;

    public function __construct(ProductRepository $repository, EntityManagerInterface $em)
    {
        $this->em = $em;
        $this->repository = $repository;
    }

    public function all(): Collection
    {
        return $this->toData($this->repository->findAll());
    }

    /**
     * @throws ProductException
     */
    public function byId(int $id): ?Product
    {
        $product = $this->repository->findById($id);
        if (!$product) {
            throw new ProductException(__("product.not_found"), HttpResponse::HTTP_NOT_FOUND, null, ['product_id' => $id]);
        }

        return $product;
    }

    /**
     * @throws ProductException
     */
    public function byName(string $name): ?Product
    {
        $product = $this->repository->findByName($name);
        if (!$product) {
            throw new ProductException(__("product.not_found"), HttpResponse::HTTP_NOT_FOUND, null, ['name' => $name]);
        }

        return $product;
    }

    /**
     * @throws ProductException
     */
    public function createProduct(array $data): Product|null
    {
        if (!$data) {
            throw new ProductException(__("product.invalid_data"), HttpResponse::HTTP_NOT_FOUND, null, ['data' => $data]);
        }

        $product_category = $this->em->getRepository(ProductCategory::class)->find($data['category']);
        if (!$product_category) {
            throw new ProductException(__("product.category_not_found"), HttpResponse::HTTP_NOT_FOUND, null, ['category_id' => $data['category']]);
        }

        $product = new Product($data['name']);
        $product->setDescription($data['description']);
        $product->setPrice($data['price']);
        $product->setCategory($product_category);
        $this->em->persist($product);
        $this->em->flush();

        return $product;
    }

    /**
     * @throws ProductException
     */
    public function updateProduct(Product $product, array $data): Product|null
    {
        if (!$data) {
            throw new ProductException(__("product.invalid_data"), HttpResponse::HTTP_NOT_FOUND, null, ['data' => $data]);
        }

        $product->setName($data['name']);
        $product->setDescription($data['description'] ?? $product->getDescription());
        $product->setPrice($data['price'] ?? $product->getPrice());
        $product->setCategory($data['category'] ?? $product->getCategory());
        $this->em->flush();

        return $product;
    }

    public function deleteProduct(Product $product): void
    {
        $this->em->remove($product);
        $this->em->flush();
    }
}

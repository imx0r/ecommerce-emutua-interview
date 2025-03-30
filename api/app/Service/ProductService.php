<?php

namespace App\Service;

use App\Entities\Product;
use App\Repositories\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Illuminate\Support\Collection;

class ProductService
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
        return $this->repository->findAll();
    }

    public function byId(int $id): ?Collection
    {
        return $this->repository->findById($id);
    }

    public function byName($name): ?Collection
    {
        return $this->repository->findByName($name);
    }

    public function createProduct($data): Product|null
    {
        if (!$data) {
            return null;
        }

        $product = new Product($data['name']);
        $product->setDescription($data['description']);
        $product->setPrice($data['price']);
        $product->setCategory($data['category']);
        $this->em->persist($product);
        $this->em->flush();

        return $product;
    }

    public function updateProduct(Product $product, $data): Product|null
    {
        if (!$data) {
            return null;
        }

        $product->setName($data['name']);
        $product->setDescription($data['description']);
        $product->setPrice($data['price']);
        $product->setCategory($data['category']);
        $this->em->flush();

        return $product;
    }
}

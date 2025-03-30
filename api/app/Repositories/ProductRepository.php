<?php

namespace App\Repositories;

use App\Entities\Product;
use Doctrine\Persistence\ObjectRepository;

class ProductRepository
{
    private ObjectRepository $products;

    public function __construct(ObjectRepository $products)
    {
        $this->products = $products;
    }

    /**
     * @return Product[]
     */
    public function findAll(): array
    {
        return $this->products->findAll();
    }

    public function findById(int $id): Product|null
    {
        return $this->products->find($id);
    }

    /**
     * @param $name
     * @return Product[]
     */
    public function findAllByName($name): array
    {
        return $this->products->findBy(['name' => $name]);
    }

    public function findByName($name): Product|null
    {
        return $this->products->findOneBy(['name' => $name]);
    }
}

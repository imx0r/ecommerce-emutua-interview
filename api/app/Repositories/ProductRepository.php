<?php

namespace App\Repositories;

use Doctrine\Persistence\ObjectRepository;
use Illuminate\Support\Collection;

class ProductRepository
{
    private ObjectRepository $products;

    public function __construct(ObjectRepository $products)
    {
        $this->products = $products;
    }

    public function findAll(): Collection
    {
        return $this->getDataFromArray($this->products->findAll());
    }

    public function findById(int $id): Collection|null
    {
        return $this->products->find($id)?->toArray();
    }

    public function findAllByName($name): Collection
    {
        return $this->getDataFromArray($this->products->findBy(['name' => $name]));
    }

    public function findByName($name): Collection|null
    {
        return $this->products->findOneBy(['name' => $name])?->toArray();
    }

    private function getDataFromArray($array): Collection
    {
        return Collection::make($array)->map(function ($product) {
            return $product->toArray();
        });
    }
}

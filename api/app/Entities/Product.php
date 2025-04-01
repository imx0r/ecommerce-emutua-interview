<?php

namespace App\Entities;

use App\Enums\EProductCategory;
use App\Traits\StoreIdAfterDeletionEntity;
use Doctrine\ORM\Mapping AS ORM;
use Illuminate\Support\Collection;

#[ORM\Table(name: 'products'), ORM\Entity]
class Product
{
    use StoreIdAfterDeletionEntity;

    #[ORM\Id, ORM\GeneratedValue(strategy: 'AUTO'), ORM\Column(type: 'integer')]
    protected int $id;

    #[ORM\Column(type: 'string', length: 255)]
    protected string $name;

    #[ORM\Column(type: 'text')]
    protected string $description;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    protected string $price;

    #[ORM\ManyToOne(targetEntity: ProductCategory::class, fetch: 'EAGER', inversedBy: 'products')]
    protected ProductCategory $category;

    public function __construct($name)
    {
        $this->name = $name;
    }

    public function getId(): int
    {
        return $this->id;
    }


    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function setDescription($description): void
    {
        $this->description = $description;
    }

    public function getPrice(): string
    {
        return $this->price;
    }

    public function setPrice($price): void
    {
        $this->price = $price;
    }

    public function getCategory(): ProductCategory
    {
        return $this->category;
    }

    public function setCategory(ProductCategory $category): void
    {
        $this->category = $category;
    }

    public function toCollection($cast = true): Collection
    {
        return Collection::make([
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'category_id' => $this->category->getId(),
            'category' => $cast ? EProductCategory::from($this->category->getName())->toString() : $this->category
        ]);
    }

    public function toArray($cast = true): array
    {
        return $this->toCollection($cast)->toArray();
    }
}

<?php

namespace App\Entities;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping AS ORM;

#[ORM\Table(name: 'product_categories'), ORM\Entity]
class ProductCategory
{
    #[ORM\Id, ORM\GeneratedValue(strategy: 'AUTO'), ORM\Column(type: 'integer')]
    protected $id;

    #[ORM\Column(type: 'string', length: 255)]
    protected $name;

    /**
     * @var ArrayCollection|Product[]
     */
    #[ORM\OneToMany(targetEntity: Product::class, mappedBy: 'category', cascade: ['persist'], orphanRemoval: true)]
    protected $products;

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName($name): void
    {
        $this->name = $name;
    }

    public function getProducts(): ArrayCollection|array
    {
        return $this->products;
    }

    public function addProduct(Product $product): void
    {
        if (!$this->products->contains($product)) {
            $product->setCategory($this);
            $this->products->add($product);
        }
    }
}

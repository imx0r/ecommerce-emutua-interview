<?php

namespace App\Traits;

use Doctrine\ORM\Mapping AS ORM;

trait StoreIdAfterDeletionEntity
{
    private ?int $storedId;

    public function getStoredId(): ?int
    {
        return $this->storedId;
    }

    #[ORM\PreRemove]
    public function setStoredId(int $storedId): static
    {
        $this->storedId = $storedId;
        return $this;
    }
}

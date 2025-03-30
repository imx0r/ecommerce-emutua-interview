<?php

namespace App\Service;

use Illuminate\Support\Collection;

abstract class EntityService
{
    public function toData($array): Collection
    {
        return Collection::make($array)->map(function ($entity) {
            return $entity?->toArray();
        });
    }
}

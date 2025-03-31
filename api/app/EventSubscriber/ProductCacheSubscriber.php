<?php

namespace App\EventSubscriber;

use App\Entities\Product;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class ProductCacheSubscriber implements EventSubscriber
{
    public function getSubscribedEvents(): array
    {
        return [
            Events::postPersist,
            Events::postUpdate,
            Events::preRemove,
            Events::postRemove,
        ];
    }

    public function postPersist(LifecycleEventArgs $eventArgs): void
    {
        $this->invalidateProductsCache();
        $this->createCache($eventArgs);
    }

    public function postUpdate(LifecycleEventArgs $eventArgs): void
    {
        $this->invalidateProductsCache();
        $this->createCache($eventArgs);
    }

    public function preRemove(LifecycleEventArgs $eventArgs): void
    {
        $entity = $eventArgs->getObject();
        $entity->setStoredId($entity->getId());
    }

    public function postRemove(LifecycleEventArgs $eventArgs): void
    {
        $this->invalidateProductCache($eventArgs);
        $this->invalidateProductsCache();
    }

    private function createCache(LifecycleEventArgs $args): void
    {
        $entity = $args->getObject();
        if ($entity instanceof Product) {
            $cacheParams = $this->getCacheProductParams($entity->getId());
            if (!Cache::put($cacheParams["key"], $entity, $cacheParams["ttl"])) {
                \Illuminate\Log\log("Product {$entity->getId()} could not be cached!");
            }
        }
    }

    private function invalidateProductCache(LifecycleEventArgs $args): void
    {
        $entity = $args->getObject();
        if ($entity instanceof Product) {
            if ($args::class === "Doctrine\ORM\Event\PostRemoveEventArgs") {
                $entityId = $entity->getStoredId();
            } else {
                $entityId = $entity->getId();
            }

            Cache::forget($this->getCacheProductParams($entityId)["key"]);
        }
    }

    private function invalidateProductsCache(): void
    {
        Cache::forget($this->getCacheProductsParams()["key"]);
    }

    private function getCacheProductParams($id): array
    {
        return [
            "key" => Str::replace(':id', $id, config('cache.keys.product.product.key')),
            "ttl" => config('cache.keys.product.product.ttl'),
        ];
    }

    private function getCacheProductsParams(): array
    {
        return [
            "key" => config('cache.keys.product.products.key'),
            "ttl" => config('cache.keys.product.products.ttl'),
        ];
    }
}

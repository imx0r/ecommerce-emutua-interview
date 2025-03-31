<?php

namespace App\Service;

use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use OpenSearch\ClientBuilder;

class OpenSearchService
{
    protected \OpenSearch\Client $client;

    public function __construct()
    {
        $hosts = Str::of(config('services.opensearch.hosts'));
        $this->client = ClientBuilder::create()
            ->setHosts($hosts->contains(',') ? $hosts->split(',') : [$hosts->value()])
            ->setSSLVerification(config('services.opensearch.verify_ssl', false))
            ->build();
    }

    public function indexProduct(array $product): Collection
    {
        $params = [
            'index' => 'products',
            'id' => $product['id'],
            'body' => $product
        ];
        return Collection::make($this->client->index($params));
    }

    public function removeProduct($id): Collection
    {
        $params = [
            'index' => 'products',
            'id' => $id,
        ];

        return Collection::make($this->client->delete($params));
    }

    public function searchById($id): Collection
    {
        $params = [
            'index' => 'products',
            'size' => 1,
            'body' => [
                'query' => [
                    'bool' => [
                        'filter' => [
                            'term' => [
                                '_id' => $id,
                            ]
                        ]
                    ]
                ]
            ]
        ];

        return Collection::make($this->client->search($params));
    }

    public function searchProducts(string $search): Collection
    {
        $params = [
            'index' => 'products',
            'body' => [
                'query' => [
                    'multi_match' => [
                        'query' => $search,
                        'fields' => ['name', 'description'],
                    ]
                ]
            ]
        ];

        return Collection::make($this->client->search($params));
    }

    public function exists($id): bool
    {
        return $this->searchById($id)->dot()->get('hits.total.value') > 0;
    }
}

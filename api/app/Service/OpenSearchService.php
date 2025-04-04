<?php

namespace App\Service;

use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use OpenSearch\Client;
use OpenSearch\GuzzleClientFactory;

class OpenSearchService
{
    protected Client $client;

    public function __construct()
    {
        $this->client = (new GuzzleClientFactory())->create([
            'base_uri' => config('services.opensearch.hosts', 'http://opensearch:9200'),
            'verify' => config('services.opensearch.verify_ssl', false),
        ]);
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

    public function searchProductById($id): Collection
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

    public function productExists($id): bool
    {
        return $this->searchProductById($id)->dot()->get('hits.total.value') > 0;
    }
}

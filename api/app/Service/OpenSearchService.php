<?php

namespace App\Service;

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

    public function indexProduct(array $product): array|string|null
    {
        $params = [
            'index' => 'products',
            'id' => $product['id'],
            'body' => $product
        ];
        return $this->client->index($params);
    }

    public function removeProduct($id): array|string|null
    {
        $params = [
            'index' => 'products',
            'id' => $id,
        ];
        return $this->client->delete($params);
    }

    public function searchProducts(string $search): array|string|null
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

        return $this->client->search($params);
    }
}

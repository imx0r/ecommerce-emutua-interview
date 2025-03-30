<?php

namespace App\Service;

use OpenSearch\ClientBuilder;

class OpenSearchService
{
    protected \OpenSearch\Client $client;

    public function __construct()
    {
        $this->client = ClientBuilder::create()
            ->setHosts([env('OPENSEARCH_HOSTS', 'http://opensearch:9200')])
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
}

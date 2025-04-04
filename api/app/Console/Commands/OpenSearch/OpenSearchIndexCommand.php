<?php

namespace App\Console\Commands\OpenSearch;

use App\Service\OpenSearchService;
use App\Service\ProductService;
use Illuminate\Console\Command;
use function Laravel\Prompts\select;
use function Laravel\Prompts\progress;

class OpenSearchIndexCommand extends Command
{
    const INDEX_KEY_PRODUCTS = 'products';

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'opensearch:index';

    public function __construct()
    {
        parent::__construct();
        $this->setDescription(__("commands.opensearch.index.description"));
    }

    /**
     * Execute the console command.
     */
    public function handle(OpenSearchService $openSearchService)
    {
        $entity = select(
            label: __("commands.opensearch.index.label"),
            options: [
                self::INDEX_KEY_PRODUCTS => __("commands.opensearch.index.products.option"),
            ],
            default: self::INDEX_KEY_PRODUCTS
        );

        switch ($entity) {
            case self::INDEX_KEY_PRODUCTS:
                $productService = resolve(ProductService::class);
                if ($productService) {
                    $products = $productService->all();
                    $progress = progress(label: __("commands.opensearch.index.products.progressing"), steps: $products->count());
                    $progress->start();
                    foreach ($products as $product) {
                        $openSearchService->indexProduct($product);
                        $progress->advance();
                    }
                    $progress->finish();
                    $this->info(trans_choice("commands.opensearch.index.products.success", $products->count(), ['count' => $products->count()]));
                    break;
                }

                $this->error(__("commands.opensearch.index.products.failed"));
                break;
            default:
                $this->error(__('commands.opensearch.index.not_found'));
        }
    }
}

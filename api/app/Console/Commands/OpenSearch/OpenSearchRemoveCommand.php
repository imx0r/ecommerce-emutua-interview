<?php

namespace App\Console\Commands\OpenSearch;

use App\Service\OpenSearchService;
use Illuminate\Console\Command;
use function Laravel\Prompts\confirm;

class OpenSearchRemoveCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'opensearch:remove {index} {id}';

    private OpenSearchService $openSearchService;

    public function __construct(OpenSearchService $openSearchService)
    {
        parent::__construct();
        $this->setDescription(__("commands.opensearch.remove.description"));
        $this->openSearchService = $openSearchService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $id = $this->argument('id');
        $index = $this->argument('index');
        if (confirm(label: __("commands.opensearch.remove.label", ["index" => $index]), yes: __("commands.prompts.confirm.yes"), no: __("commands.prompts.confirm.no"))) {
            if ($this->openSearchService->productExists($id)) {
                $this->openSearchService->removeProduct($id);
                $this->info(__('commands.opensearch.remove.success'));
            } else {
                $this->error(__('commands.opensearch.remove.not_found'));
            }
        }
    }
}

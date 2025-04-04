<?php

return [
    'prompts' => [
        'confirm' => [
            'yes' => 'Yes',
            'no' => 'No',
        ]
    ],
    'opensearch' => [
        'index' => [
            'label' => 'Which entity you want to index?',
            'description' => 'Index an entity to OpenSearch.',
            'products' => [
                'option' => 'Products',
                'progressing' => 'Indexing products ...',
                'success' => '{1} :count product was successfully indexed.|[2,*] :count products were successfully indexed.',
                'failed' => 'An error occurred while trying to index products.',
            ],
            'not_found' => 'You have to select at least one entity from the list.',
        ],
        'remove' => [
            'label' => 'Are you sure you want to remove this item from :index index?',
            'description' => 'Remove an entity from OpenSearch.',
            'success' => 'The item was successfully removed from the index!',
            'not_found' => 'The item was not found into this index.',
        ]
    ]
];

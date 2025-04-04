<?php

return [
    'prompts' => [
        'confirm' => [
            'yes' => 'Sim',
            'no' => 'Não',
        ]
    ],
    'opensearch' => [
        'index' => [
            'description' => 'Indexa uma entidade ao OpenSearch.',
            'label' => 'Qual entidade você deseja indexar?',
            'products' => [
                'option' => 'Produtos',
                'progressing' => 'Indexando produtos ...',
                'success' => '{1} :count produto foi indexado com sucesso!|[2,*] :count produtos foram indexados com sucesso!',
                'failed' => 'Não foi possível obter o serviço da entidade Produto!'
            ],
            'not_found' => 'Você deve selecionar uma entidade da lista para indexar.'
        ],
        'remove' => [
            'label' => 'Você tem certeza que deseja remover este item da index :index?',
            'description' => 'Remover uma entidade do OpenSearch.',
            'success' => 'O item foi removido com sucesso da index!',
            'not_found' => 'O item não foi encontrado na index.',
        ]
    ]
];

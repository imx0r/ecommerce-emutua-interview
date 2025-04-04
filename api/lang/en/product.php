<?php

return [
    'create' => [
        'success' => 'Product has been created.',
        'failed' => 'Occurred an error while trying to create product.',
        'forbidden' => 'You do not have permission to create product.',
    ],
    'delete' => [
        'success' => 'Product has been deleted.',
        'failed' => 'Occurred an error while trying to delete product.',
        'forbidden' => 'You do not have permission to delete product.',
    ],
    'update' => [
        'success' => 'Product has been updated.',
        'failed' => 'Occurred an error while trying to update product.',
        'forbidden' => 'You do not have permission to update product.',
    ],
    'category' => [
        'cosmetic' => 'Cosmetic',
        'accessory' => 'Accessory',
        'electronic' => 'Electronics',
        'health' => 'Health',
        'clothing' => 'Clothing',
    ],
    'invalid_product' => 'Product does not exist or is invalid.',
    'not_found' => 'Product not found.',
    'invalid_data' => 'Invalid Product data.',
    'category_not_found' => 'Product category could not be found.',
    'upload' => [
        'success' => 'Product image has been uploaded.',
        'failed' => 'Failed to upload the product image.',
    ]
];

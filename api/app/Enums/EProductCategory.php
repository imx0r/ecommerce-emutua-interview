<?php

namespace App\Enums;

enum EProductCategory : string
{
    case COSMETIC = 'cosmetic';
    case ACCESSORY = 'accessory';
    case ELECTRONIC = 'electronic';
    case HEALTH = 'health';
    case CLOTHING = 'clothing';

    public function toString() : string
    {
        return match ($this) {
            self::COSMETIC => __('product.category.cosmetic'),
            self::ACCESSORY => __('product.category.accessory'),
            self::ELECTRONIC => __('product.category.electronic'),
            self::HEALTH => __('product.category.health'),
            self::CLOTHING => __('product.category.clothing'),
        };
    }
}

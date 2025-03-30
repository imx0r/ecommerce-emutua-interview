<?php

namespace App\Enums;

enum EProductCategory : string
{
    case GENERIC = 'generic';
    case FURNITURE = 'furniture';
    case ELECTRONIC = 'electronic';
    case HEALTH = 'health';
    case CLOTHING = 'clothing';

    public function toString() : string
    {
        return match ($this) {
            self::GENERIC => __('product.category.generic'),
            self::FURNITURE => __('product.category.furniture'),
            self::ELECTRONIC => __('product.category.electronic'),
            self::HEALTH => __('product.category.health'),
            self::CLOTHING => __('product.category.clothing'),
        };
    }
}

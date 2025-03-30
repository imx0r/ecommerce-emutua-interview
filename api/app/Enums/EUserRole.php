<?php

namespace App\Enums;

enum EUserRole : int
{
    case USER = 1;
    case ADMIN = 2;

    public function label() : string
    {
        return match ($this) {
            self::USER => __('user'),
            self::ADMIN => __('admin'),
        };
    }
}

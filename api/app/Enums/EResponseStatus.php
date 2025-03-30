<?php

namespace App\Enums;

enum EResponseStatus : string
{
    case SUCCESS = 'success';
    case ERROR = 'error';
    case FAILED = 'failed';
    case WARNING = 'warning';
    case UNKNOWN = 'unknown';
}

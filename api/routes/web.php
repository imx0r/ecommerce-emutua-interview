<?php

use Illuminate\Support\Facades\Route;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

Route::get('/', function () {
    return response()->json(["status" => "live", "version" => 1, "status_code" => HttpResponse::HTTP_OK], HttpResponse::HTTP_OK);
});

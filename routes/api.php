<?php

use App\Http\Controllers\Api\ItemController;

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/items', [ItemController::class, 'index']);

    Route::get('/items/{id}', [ItemController::class, 'show']);

    Route::post('/items', [ItemController::class, 'store']);

});
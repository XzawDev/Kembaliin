<?php

// API Item routes
use App\Http\Controllers\Api\ItemController;

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/items', [ItemController::class, 'index']);

    Route::get('/items/{id}', [ItemController::class, 'show']);

    Route::post('/items', [ItemController::class, 'store']);

    Route::get('/items/verify/{qrToken}', [ItemController::class, 'verifyQr']);

    Route::post('/items/{id}/complete', [ItemController::class, 'completeReturn'])
    ->middleware('auth:sanctum');
});

// API Claim routes
use App\Http\Controllers\Api\ClaimController;

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/items/{itemId}/claim', [ClaimController::class, 'store']);

});
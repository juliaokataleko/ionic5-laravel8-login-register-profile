<?php

use App\Http\Controllers\API\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['middleware' => 'CORS'], function() {
    
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    Route::post('checkusername', [AuthController::class, 'checkUsername']);
    Route::post('checkphone', [AuthController::class, 'checkPhone']);
    Route::post('update-user', [AuthController::class, 'update']);

    Route::post('update-avatar', [AuthController::class, 'uploadAvatar']);
    Route::post('update-password', [AuthController::class, 'updatePassword']);
    Route::post('delete-account', [AuthController::class, 'deleteAccount']);
    Route::post('activate', [AuthController::class, 'activate']);
    Route::post('account-recover', [AuthController::class, 'recover']);
    Route::post('account-reset', [AuthController::class, 'reset']);
    Route::post('resend-code', [AuthController::class, 'resendCode']);

});

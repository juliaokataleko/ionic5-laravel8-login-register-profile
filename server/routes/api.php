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

Route::post('login', [AuthController::class, 'login'])->middleware('CORS');

Route::post('register', [AuthController::class, 'register'])->middleware('CORS');
Route::post('checkusername', [AuthController::class, 'checkUsername'])->middleware('CORS');
Route::post('checkphone', [AuthController::class, 'checkPhone'])->middleware('CORS');
Route::post('update-user', [AuthController::class, 'update'])->middleware('CORS');

Route::post('update-avatar', [AuthController::class, 'uploadAvatar'])->middleware('CORS');
Route::post('update-password', [AuthController::class, 'updatePassword'])->middleware('CORS');
Route::post('delete-account', [AuthController::class, 'deleteAccount'])->middleware('CORS');
Route::post('activate', [AuthController::class, 'activate'])->middleware('CORS');
Route::post('account-recover', [AuthController::class, 'recover'])->middleware('CORS');
Route::post('account-reset', [AuthController::class, 'reset'])->middleware('CORS');
Route::post('resend-code', [AuthController::class, 'resendCode'])->middleware('CORS');

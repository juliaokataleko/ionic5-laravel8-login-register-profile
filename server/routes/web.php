<?php

use App\Models\User;
use App\SMS\SMSApi;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Auth::routes();

Route::get('/', function () {
    return view('welcome');
});

Route::group(['middleware'=>'auth', 'prefix' => '/dashboard'], function() {
    Route::get('users', function () {
        $users = User::paginate(15);
        return view('dashboard.users.index', compact('users'));
    })->name('users');
});


Route::get('test-sms', function() {
    
    $sms = new SMSApi();
    
    $message = $sms->response("Olá Julião, Muito Obrigado por se inscrever na nossa rede social...")->current();

    if ($message->getStatus() == 0) {
        echo "The message was sent successfully\n";
    } else {
        echo "The message failed with status: " . $message->getStatus() . "\n";
    }
});


Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

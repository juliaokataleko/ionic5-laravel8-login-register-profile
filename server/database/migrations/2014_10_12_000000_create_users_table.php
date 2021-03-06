<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->string('name');
            $table->string('username')->unique();
            $table->string('email')->unique()->nullable();
            $table->string('phone')->unique()->nullable();

            $table->string('gender')->nullable();
            $table->string('address')->nullable();
            $table->string('birthday')->nullable();
            $table->string('avatar')->nullable();
            $table->integer('level')->default(3);
            $table->integer('active')->default(1);
            $table->text('about')->nullable();

            $table->text('confirmation_code')->nullable();
            $table->text('new_password_code')->nullable();
            $table->timestamp('confirmation_date_sent')->nullable();

            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}

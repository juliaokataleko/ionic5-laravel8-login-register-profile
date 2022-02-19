<?php

namespace Database\Seeders;

use App\Models\User;
use Faker\Provider\Uuid;
use Illuminate\Database\Seeder;
use Ramsey\Uuid\Uuid as UuidUuid;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\User::factory(100)->create();
        $user = User::create([
            'name' => 'Julião FK',
            'email' => 'juliofeli78@gmail.com',
            'username'=> 'juliaokataleko',
            'phone' => '922660717',
            'password' => bcrypt(123456),
            'uuid' => UuidUuid::uuid4(),
            'level' => 1
        ]);
    }
}

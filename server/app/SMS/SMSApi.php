<?php

namespace App\SMS;

use App\Models\User;
use \Vonage\Client\Credentials\Basic;
use \Vonage\Client;
use \Vonage\SMS\Message\SMS;

class SMSApi {
    private $basic, $client;

    public function __construct() {
        $this->basic  = new Basic("77f64f51", "Uht1udlkUeSgBtid");
        $this->client = new Client($this->basic);
    }

    public function response($message, $phoneNumber = "244922660717")
    {
        // @TODO - remove the line below
        $phoneNumber = "244922660717";
        return $this->client->sms()->send(
            new SMS($phoneNumber, env('APP_NAME'), $message)
        );

    }

    public function confirmationCode(User $user)
    {
        $message = "Olá {$user->name}. Código: " . $user->confirmation_code;
        $phoneNumber = $user->phone;
        return $this->response($message, $phoneNumber);
    }
}
<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $dateOfBirth = $this->birthday;

        $today = date("Y-m-d");
        $diff = date_diff(date_create($dateOfBirth), date_create($today));

        $age = $diff->format('%y');

        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'name' => $this->name,
            'username' => $this->username,
            'email' => $this->email,
            'phone' => $this->phone,
            'created_at' => $this->created_at,
            'gender' => $this->gender,
            'birthday' => $this->birthday,
            'image' => $this->image,
            'about' => $this->about,
            'age' => (int)$age
        ];
    }
}

<?php

namespace App\Http\Controllers\API;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Ramsey\Uuid\Uuid;

class AuthController
{
    private $postJson;

    public function __construct()
    {
        $postjson = json_decode(file_get_contents('php://input'), true);
        $this->postJson = $postjson;
    }

    public function login()
    {
        $postjson = json_decode(file_get_contents('php://input'), true);

        $user = User::where('username', $postjson['username'])
            ->orWhere('phone', $postjson['username'])
            ->orWhere('email', $postjson['username'])
            // ->where('password', $postjson['password'])
            ->first();

        return $this->logginProcess($user);
    }

    public function register()
    {
        $postjson = json_decode(file_get_contents('php://input'), true);

        $data = [
            'name' => $postjson['username'],
            'username' => $postjson['username'],
            'phone' => $postjson['phone'],
            'password' => bcrypt($postjson['password']),
        ];

        $data['uuid'] = Uuid::uuid4();

        // check if username and phone exists

        $user = User::create($data);

        return $this->logginProcess($user, true);
    }

    public function logginProcess($user, $newUser = false)
    {
        $logged = false;
        $postjson = $this->postJson;

        if (!is_null($user)) {
            if (password_verify($postjson['password'], $user->password)) {
                $logged = true;
            }
        }

        if ($logged) {

            $users = User::where('id', $user->id)->get();
            $userRes = UserResource::collection($users);

            return response()->json([
                'success' => true,
                'result' => $userRes
            ]);
        }

        $message = "O login falhou...";

        if ($newUser) $message = "Ocorreu um erro...";

        return response()->json([
            'success' => false,
            'msg' => $message
        ]);
    }

    public function checkUsername()
    {
        $checkUsername = User::where('username', $this->postJson['username'])->first();

        if (!is_null($checkUsername)) {
            return response()->json([
                'user_exists' => true,
                'msg' => "Este username já está sendo usado"
            ]);
        } else {
            return response()->json([
                'user_exists' => false,
            ]);
        }
    }

    public function checkPhone()
    {
        $checkUsername = User::where('phone', $this->postJson['phone'])->first();

        if (!is_null($checkUsername)) {
            return response()->json([
                'phone_exists' => true,
                'msg' => "Este telefone já está sendo usado"
            ]);
        } else {
            return response()->json([
                'phone_exists' => false,
            ]);
        }
    }

    public function update(Request $request)
    {
        $user = User::find($this->postJson['id']);

        // echo ($this->postJson['file']);
        // echo $request->file;

        if (!is_null($user)) {
            $data = [
                'name' => $this->postJson['name'],
                'username' => $this->postJson['username'],
                'phone' => $this->postJson['phone'],
                'about' => $this->postJson['about'],
                'gender' => $this->postJson['gender'],
                'birthday' => $this->postJson['birthday'],
            ];

            $user->update($data);

            // echo json_encode($request->all());

            // if ($request->hasFile('file') && $request->file('file')->isValid()) {
            //     echo "Yahhhh";
            //     $this->updateAvatar($request, $user);
            // } else {
            //     var_dump($_FILES['file']);
            //     echo $this->postJson['file'];
            // }

            $users = User::where('id', $user->id)->get();
            $userRes = UserResource::collection($users);

            return response()->json([
                'success' => true,
                'msg' => "Conta atualizada",
                'result' => $userRes
            ]);
        } else {
            return response()->json([
                'success' => false,
                'msg' => "Usuário não encontrado"
            ]);
        }
    }

    public function updateAvatar(Request $request, $user)
    {
        $path = "uploads/users";

        // Check if is there a photo upload
        if (isset($_FILES['file']) && !empty($_FILES['file']['tmp_name'])) {

            $permitidos = array(
                'image/jpeg', 'image/jpg', 'image/png'
            );

            if (!file_exists($path)) {
                mkdir($path, 0777, true);
            }

            if (in_array($_FILES['file']['type'], $permitidos)) {


                $nome = time() . rand(0, 9999) . '.jpg';

                if (!null == $user->avatar && file_exists("$path/" . $user->avatar)) {
                    if (unlink("$path/" . $user->avatar)) {
                    }
                }

                if (move_uploaded_file($_FILES['file']['tmp_name'], "$path/" . $nome)) {

                    // $tipo = $_FILES['file']['type'];

                    // $tmpname = $nome;

                    // list($width_orig, $height_orig) = getimagesize('uploads/users/' . $tmpname);
                    // $ratio = $width_orig / $height_orig;

                    // $width = $width_orig;
                    // $height = $height_orig;

                    // $img = imagecreatetruecolor($width, $height);
                    // if ($tipo == 'image/jpeg') {
                    //     $origi = imagecreatefromjpeg('uploads/users/' . $tmpname);
                    // } else if ($tipo == 'image/png') {
                    //     $origi = imagecreatefrompng('uploads/users/' . $tmpname);
                    // }

                    // imagecopyresampled($img, $origi, 0, 0, 0, 0, $width, $height, $width_orig, $height_orig);
                    // imagejpeg($img, 'uploads/users/' . $tmpname, 90);

                    $user->update([
                        'avatar' => $nome
                    ]);
                }
            }
        }

        // Check if want to delete the avatar
        if ((!empty($request->delete_avatar) || !is_null($request->delete_avatar)) && $request->delete_avatar == "1") {
            if (!null == $user->avatar && file_exists("$path/" . $user->avatar)) {
                if (unlink("$path/" . $user->avatar)) {
                    $user->avatar = null;
                    $user->save();
                }
            }
        }
    }

    public function uploadAvatar(Request $request)
    {
        $user = User::find($request->id);

        if ($request->hasFile('file') && $request->file('file')->isValid()) {
            $this->updateAvatar($request, $user);

            $users = User::where('id', $user->id)->get();
            $userRes = UserResource::collection($users);

            return response()->json([
                'success' => true,
                'msg' => "Conta atualizada",
                'result' => $userRes
            ]);
        }

        return response()->json([
            'success' => false,
            'msg' => "Alguma coisa correu mal."
        ]);
    }
}

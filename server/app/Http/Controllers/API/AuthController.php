<?php

namespace App\Http\Controllers\API;

use App\Http\Resources\UserResource;
use App\Models\User;
use App\SMS\SMSApi;
use Illuminate\Http\Request;
use Ramsey\Uuid\Uuid;

class AuthController
{

    public function register(Request $request)
    {
        // return response()->json([
        //     'data' => json_encode($request->all())
        // ]);

        $data = $request->validate([
            // 'name' => 'required',
            'username' => 'required',
            'phone' => 'required',
            'password' => 'required|min:5',
        ]);

        $data['name'] = $data['username'];

        $data['password'] = bcrypt($data['password']);
        $data['uuid'] = Uuid::uuid4();
        $data['active'] = 0;

        // check if username and phone exists

        $data['confirmation_code'] = rand(1000, 9999);
        $data['confirmation_date_sent'] = now();

        $user = User::create($data);

        // send confirmation code
        $sms = new SMSApi();
        $sms->confirmationCode($user);

        return $this->logginProcess($request, $user, true);
    }

    public function login(Request $request)
    {
        $user = User::where('username', $request->username)
            ->orWhere('phone', $request->username)
            ->orWhere('email', $request->username)
            // ->where('password', $postjson['password'])
            ->first();

        return $this->logginProcess($request, $user);
    }

    public function logginProcess(Request $request, $user, $newUser = false)
    {
        $logged = false;
        if (!is_null($user)) {
            if (password_verify($request->password, $user->password)) {
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

    public function checkUsername(Request $request)
    {
        $checkUsername = User::where('username', $request->username)->first();

        if (!is_null($checkUsername)) {
            return response()->json([
                'user_exists' => true,
                'msg' => "Este username já está sendo usado"
            ]);
        } else {
            return response()->json([
                'user_exists' => false,
                'msg' => ""
            ]);
        }
    }

    public function checkPhone(Request $request)
    {
        $checkUsername = User::where('phone', $request->phone)->first();

        if (!is_null($checkUsername)) {
            return response()->json([
                'phone_exists' => true,
                'msg' => "Este telefone já está sendo usado"
            ]);
        } else {
            return response()->json([
                'phone_exists' => false,
                'msg' => ""
            ]);
        }
    }

    public function update(Request $request)
    {
        $user = User::find($request->id);

        if (!is_null($user)) {
            $data = $request->validate([
                'name' => 'required',
                'username' => 'required',
                'email' => 'nullable',
                'phone' => 'nullable',
                'about' => 'nullable',
                'gender' => 'nullable',
                'birthday' => 'nullable',
            ]);

            // check username
            $userName = User::where('id', '!=', $user->id)
            ->where('username', $data['username'])->first();

            if(!is_null($userName)) {
                return response()->json([
                    'success' => false,
                    'msg' => "Este nome de usuário já está sendo usado."
                ]);
            }

            // check phone
            $userPhone = User::where('id', '!=', $user->id)
            ->where('phone', $data['phone'])->first();

            if (!is_null($userPhone)) {
                return response()->json([
                    'success' => false,
                    'msg' => "Este telefone já está sendo usado."
                ]);
            }

            // check email
            $userEmail = User::where('id', '!=', $user->id)
            ->where('email', $data['email'])->first();

            if (!is_null($userEmail)) {
                return response()->json([
                    'success' => false,
                    'msg' => "Este email já está sendo usado."
                ]);
            }

            $user->update($data);

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

    public function updatePassword(Request $request)
    {
        $user = User::find($request->userid);
        $password = $request->password;
        $npassword = $request->npassword;
        $cpassword = $request->cpassword;

        if(!empty($password)) {
            if (password_verify($password, $user->password)) {
                
                if(strlen($npassword) > 4 && $npassword == $cpassword ) {
                    $user->password = bcrypt($npassword);
                    $user->save();
                    
                    return response()->json([
                        'success' => true,
                        'msg' => "Senha alterada com sucesso."
                    ]);
                } else {
                    return response()->json([
                        'success' => false,
                        'msg' => "A nova senha deve ter no mínimo 5 caracteres e precisa ser confirmada."
                    ]);
                }
            } else {
                return response()->json([
                    'success' => false,
                    'msg' => "A senha atual está incorreta."
                ]);
            }
        } else {
            return response()->json([
                'success' => false,
                'msg' => "Por favor informe a senha atual."
            ]);
        }

    }

    public function deleteAccount(Request $request)
    {
        $user = User::where('uuid', $request->uuid)->first();

        if(!is_null($user)) {
            // delete user and related data
            $user->delete();
            return response()->json([
                'success' => true,
                'msg' => "Usuário excluído"
            ]);
        }

        return response()->json([
            'success' => false,
            'msg' => "Usuário não foi encontrado"
        ]);
    }

    public function activate(Request $request)
    {
        $user = User::where('uuid', $request->uuid)->first();

        if (!is_null($user)) {

            $timestamp1 = strtotime($user->confirmation_date_sent);
            $timestamp2 = strtotime(now());
            $hour = abs($timestamp2 - $timestamp1) / (60 * 60);

            if($user->confirmation_code == $request->confirmation_code) {
                // check the date
                
                if($hour >= 1) {
                    return response()->json([
                        'success' => false,
                        'msg' => "Código expirado. Reenviar"
                    ]);
                
                } else {

                    $user->active = 1;
                    $user->save();

                    $users = User::where('id', $user->id)->get();
                    $userRes = UserResource::collection($users);

                    return response()->json([
                        'success' => true,
                        'msg' => "Conta ativada com sucesso. Obrigado por se juntar na nossa comunidade.",
                        'result' => $userRes
                    ]);
                }
            } else {
                return response()->json([
                    'success' => false,
                    'msg' => "Código incorreto. Hora: " . $hour
                ]);
            }
            return response()->json([
                'success' => true,
                'msg' => "Usuário excluído"
            ]);
        }

        return response()->json([
            'success' => false,
            'msg' => "Usuário não foi encontrado"
        ]);
    }

    public function recover(Request $request)
    {
        $user_name = $request->username;
        // $user_name = str_replace('+', '', $user_name);
        // $user_name = trim($user_name);

        $user = User::where('username', $user_name)
            ->orWhere('phone', $user_name)
            ->orWhere('email', $user_name)
            // ->where('password', $postjson['password'])
            ->first();

        if(!is_null($user)) {
            // send recover code

            $data['confirmation_code'] = rand(1000, 9999);
            $data['confirmation_date_sent'] = now();

            $user->update($data);

            // send confirmation code
            $sms = new SMSApi();
            $message = $sms->confirmationCode($user);


            // if ($message->getStatus() == 0) {

            // return the user
            $users = User::where('id', $user->id)->get();
            $userRes = UserResource::collection($users);

            return response()->json([
                'success' => true,
                'msg' => "Código de recuperação enviado para o seu telefone.<hr>Verifique seu telemóvel e coloque o código a baixo.",
                'result' => $userRes
            ]);

            // } else {
            //     return response()->json([
            //         'success' => false,
            //         'msg' => "Ocorreu um erro écnico. Tente novamente."
            //     ]);
            // }
            

        } else {
            return response()->json([
                'success' => false,
                'msg' => "Não foi encontrado um usuário com a informação fornecida."
            ]);
        }
    }

    public function reset(Request $request)
    {
        $data = $request->validate([
            'password' => 'min:5'
        ]);

        $user_name = $request->username;
        // $user_name = str_replace('+', '', $user_name);
        // $user_name = trim($user_name);

        $user = User::where('username', $user_name)
            ->orWhere('phone', $user_name)
            ->orWhere('email', $user_name)
            // ->where('password', $postjson['password'])
            ->first();

        if (!is_null($user)) {
            // reset account

            $timestamp1 = strtotime($user->confirmation_date_sent);
            $timestamp2 = strtotime(now());
            $hour = abs($timestamp2 - $timestamp1) / (60 * 60);

            if ($user->confirmation_code == $request->code) {
                // check the date

                if ($hour >= 1
                ) {
                    return response()->json([
                        'success' => false,
                        'msg' => "Código expirado. Reenviar"
                    ]);
                } else {

                    $user->password = bcrypt($request->password);
                    $user->save();

                    $users = User::where('id', $user->id)->get();
                    $userRes = UserResource::collection($users);

                    return response()->json([
                        'success' => true,
                        'msg' => "Conta recuperada com sucesso.",
                        'result' => $userRes
                    ]);
                }
            } else {
                return response()->json([
                    'success' => false,
                    'msg' => "Código incorreto." 
                ]);
            }           

        } else {
            return response()->json([
                'success' => false,
                'msg' => "$user_name - Não foi encontrado um usuário com a informação fornecida."
            ]);
        }
    }

    public function resendCode(Request $request)
    {
        $phone = $request->phone;

        $user = User::where('phone', $phone)
            ->first();

        if (!is_null($user)) {
            // send recover code

            $data['confirmation_code'] = rand(1000, 9999);
            $data['confirmation_date_sent'] = now();

            $user->update($data);

            // send confirmation code
            $sms = new SMSApi();
            $message = $sms->confirmationCode($user);

            // if ($message->getStatus() == 0) {

            // return the user
            $users = User::where('id', $user->id)->get();
            $userRes = UserResource::collection($users);

            return response()->json([
                'success' => true,
                'msg' => "Código enviado para o seu telefone.<hr>Verifique seu telemóvel e informe o código.",
                'result' => $userRes
            ]);

        } else {
            return response()->json([
                'success' => false,
                'msg' => "Não foi encontrado um usuário com a informação fornecida."
            ]);
        }
    }
}

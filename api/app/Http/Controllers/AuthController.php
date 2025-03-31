<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): \Illuminate\Http\JsonResponse
    {
        $user = User::create($request->validated());
        if (!$user) {
            return response()->json([
                "status" => "failed",
                "status_code" => HttpResponse::HTTP_BAD_REQUEST,
                "message" => __('auth.create.failed')
            ], HttpResponse::HTTP_BAD_REQUEST);
        }

        $token = $user->createToken(config('authToken'))->plainTextToken;
        return response()->json([
            "user" => $user,
            "token" => $token,
        ], HttpResponse::HTTP_CREATED);
    }

    public function login(LoginRequest $request): \Illuminate\Http\JsonResponse
    {
        $user = User::where("username", $request->input("username"))->first();
        if (!$user || !Hash::check($request->input("password"), $user->password)) {
            throw ValidationException::withMessages([
                "username" => [__('auth.login.failed')],
            ]);
        }

        $token = $user->createToken('authToken')->plainTextToken;
        return response()->json([
            "status" => "success",
            "status_code" => HttpResponse::HTTP_OK,
            "message" => __('auth.login.success'),
            "token" => $token
        ], HttpResponse::HTTP_OK);
    }

    public function logout(Request $request): \Illuminate\Http\JsonResponse
    {
        auth('sanctum')->user()->currentAccessToken()->delete();
        return response()->json([
            "status" => "success",
            "status_code" => HttpResponse::HTTP_OK,
            "message" => __('auth.logged_out')
        ], HttpResponse::HTTP_OK);
    }

    public function me(Request $request): \Illuminate\Http\JsonResponse
    {
        return response()->json($request->user(), HttpResponse::HTTP_OK);
    }
}

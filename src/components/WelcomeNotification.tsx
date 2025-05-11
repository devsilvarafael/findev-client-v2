"use client";


import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export const WelcomeNotification = () => {
  const router = useNavigate();
  return (
    <main className="flex flex-col justify-center items-center h-screen">
      <div className="flex flex-col justify-between h-[600px] max-w-md p-4 shadow-md bg-white rounded-md ">
        <img src="/welcome.svg" />
        <h2 className="text-3xl font-semibold text-center uppercase text-main">
          Seja bem-vindo!
        </h2>
        <p className="text-sm text-gray-500 text-center">
          Seu cadastro foi realizado com sucesso.
        </p>

        <Button
          className="mt-4 w-full bg-main"
          onClick={() => router("/login")}
        >
          Login
        </Button>
      </div>
    </main>
  );
};

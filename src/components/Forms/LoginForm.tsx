import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

import { LoginFormProps } from "@/types/LoginForm";
import { Link } from "react-router-dom";

export const LoginForm = ({ onSubmit, onChange, user, isLoading = false }: LoginFormProps) => {
  return (
    <form className="flex flex-col gap-2 w-2/5" onSubmit={onSubmit}>
      <Label htmlFor="email">Entre com seu e-mail</Label>
      <Input 
        value={user.email} 
        onChange={onChange} 
        name="email" 
        type="email" 
        disabled={isLoading}
      />

      <Label htmlFor="password">Entre com sua senha</Label>
      <Input 
        value={user.password} 
        onChange={onChange} 
        name="password" 
        type="password" 
        disabled={isLoading}
      />

      <div className="flex justify-between my-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="remember-me" disabled={isLoading} />
          <Label
            htmlFor="remember-me"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Lembrar-me
          </Label>
        </div>

        <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-main-foreground">
          Recuperar senha
        </Label>
      </div>

      <Button 
        type="submit" 
        className="bg-main w-full bg-primary" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Entrando...
          </>
        ) : (
          "Login"
        )}
      </Button>

      <div className="text-center">
        <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Não tem uma conta?{" "}
          <Link to="/register" className="text-main">
            Cadastre-se agora!
          </Link>
        </Label>
      </div>
    </form>
  );
};

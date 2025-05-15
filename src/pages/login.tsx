import { LoginForm } from "@/components/Forms/LoginForm";
import { useUserContext } from "@/contexts/UserContext";
import api from "@/services/api";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { updateUserData } = useUserContext();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    localStorage.clear();
  }, [])

  const handleChangeForm = (event: ChangeEvent<HTMLInputElement>) => {
    setUser((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmitForm = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: user.email,
        password: user.password,
      });

      if (response.status === 200) {
        // Store auth token
        localStorage.setItem("authToken", JSON.stringify(response.data.token));

        // Store basic user data in @User
        const basicUserData = {
          id: response.data.id,
          role: response.data.role,
          email: response.data.email,
        };

        localStorage.setItem("@User", JSON.stringify(basicUserData));

        // Fetch and store user details
        let userDetails;
        if (response.data.role === "RECRUITER") {
          const detailsRes = await api.get(`/recruiters/${response.data.id}`);
          userDetails = detailsRes.data;
        } else if (response.data.role === "DEVELOPER") {
          const detailsRes = await api.get(`/developers/${response.data.id}`);
          userDetails = detailsRes.data;
        } else if (response.data.role === "ADMINISTRATOR") {
          const detailsRes = await api.get(`/admin/${response.data.id}`);
          userDetails = detailsRes.data;
        }

        // Store complete user details in @UserDetails
        if (userDetails) {
          const completeUserData = {
            ...userDetails,
            ...basicUserData,
          };
          localStorage.setItem("@UserDetails", JSON.stringify(completeUserData));

          updateUserData(completeUserData);
        }

        // Navigate based on role
        if (response.data.role === "DEVELOPER") {
          navigate("/home");
        }
        if (response.data.role === "RECRUITER") {
          navigate("/jobs/announces");
        }
        if (response.data.role === "ADMINISTRATOR") {
          navigate(`/admin/recruiters/${userDetails?.company?.id || userDetails?.companyId}`);
        }
      }

      return response.data;
    } catch (err: unknown) {
      console.log(err.response)
      if (err.response.status === 401) {
        toast.error(err.response.data)
        return
      }
      if (err instanceof Error && err.message) {
        toast.error(err.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      localStorage.clear();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex h-screen w-screen items-center justify-between px-20 gap-4">
      <aside className="h-3/4 w-1/2 flex justify-center items-center">
        <img
          src="/illustrations/stars-illustration.png"
          width={400}
          height={400}
          alt="Stars Illustration"
        />
      </aside>
      <aside className="flex flex-col h-3/4 w-1/2 justify-center items-center space-y-2">
        <img
          src={"/findev-minimal-logo.svg"}
          width={60}
          height={60}
          alt="Findev Logo"
        />

        <h2 className="text-2xl font-bold">Bem-vindo!</h2>
        <p>Faça login na sua conta.</p>

        <LoginForm
          user={user}
          onSubmit={handleSubmitForm}
          onChange={handleChangeForm}
          isLoading={isLoading}
        />
      </aside>
    </main>
  );
}

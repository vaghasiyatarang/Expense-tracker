"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, Lock } from "lucide-react";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const router = useRouter();
  const [error, setError] = useState("");

  const onSubmit = async (data: FormData) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200">
        
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Login to continue
          </p>
        </div>

        {/* Global Error */}
        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Email - Floating + Icon */}
          <div className="relative">
            <Mail
              className="absolute left-3 top-3 text-gray-400"
              size={18}
            />
            <input
              type="email"
              {...register("email")}
              placeholder=" "
              className={`peer w-full pl-10 pr-3 pt-5 pb-2 border rounded-lg bg-transparent focus:outline-none transition-all
              ${
                errors.email
                  ? "border-red-500"
                  : "focus:outline-none focus:border-blue-500"
              }`}
            />
            <label
              className="absolute left-10 top-2 text-sm text-gray-500 transition-all
              peer-placeholder-shown:top-3.5 
              peer-placeholder-shown:text-base 
              peer-placeholder-shown:text-gray-400
              peer-focus:top-2 
              peer-focus:text-sm 
              peer-focus:text-blue-300"
            >
              Email
            </label>
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password - Floating + Icon */}
          <div className="relative">
            <Lock
              className="absolute left-3 top-3 text-gray-400"
              size={18}
            />
            <input
              type="password"
              {...register("password")}
              placeholder=" "
              className={`peer w-full pl-10 pr-3 pt-5 pb-2 border rounded-lg bg-transparent focus:outline-none transition-all
              ${
                errors.password
                  ? "border-red-500"
                  : "focus:outline-none focus:border-blue-500"
              }`}
            />
            <label
              className="absolute left-10 top-2 text-sm text-gray-500 transition-all
              peer-placeholder-shown:top-3.5 
              peer-placeholder-shown:text-base 
              peer-placeholder-shown:text-gray-400
              peer-focus:top-2 
              peer-focus:text-sm 
              peer-focus:text-blue-300"
            >
              Password
            </label>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full cursor-pointer bg-gradient-to-r from-green-600 to-emerald-500 hover:opacity-90 text-white py-2.5 rounded-lg font-semibold transition-all shadow-md"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="mt-5 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
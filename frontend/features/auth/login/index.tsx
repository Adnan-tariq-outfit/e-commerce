"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { LoginFormType, loginSchema } from "./login.data";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLoginMutation } from "@/services/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components";
import { LayoutGrid, ShoppingBag, Globe, MessageCircle, Shield, Users } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormType): Promise<void> => {
    toast.promise(login(data).unwrap(), {
      loading: "Signing in...",
      success: () => {
        const returnTo = searchParams.get("returnTo") ?? "/";
        router.replace(returnTo);
        return "Signed in successfully!";
      },
      error: (err: any) => err?.data?.message || "Login failed. Please check your credentials.",
    });
  };
  
  return (
    <div className="min-h-screen w-full flex p-0 md:p-4 justify-center bg-background md:bg-muted">
      <div className="w-full bg-background md:rounded-3xl md:shadow-lg md:border md:border-border flex flex-col md:flex-row overflow-hidden">
        {/* Left Side - Branding & Visual */}
        <div className="flex-1 relative hidden md:flex flex-col justify-between rounded-2xl overflow-hidden m-3">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-orange-600 to-amber-700" />

          {/* Decorative Circles */}
          <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

          {/* Content */}
          <div className="relative z-10 p-10 flex flex-col justify-between h-full">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <LayoutGrid className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                FORMA
              </span>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center max-w-md my-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
                Your ultimate shopping destination
              </h2>
              <p className="text-white/80 text-base lg:text-lg mb-8">
                Discover the best products, exclusive deals, and an unparalleled e-commerce experience.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2.5">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3.5 py-1.5 rounded-full">
                  <ShoppingBag className="w-4 h-4 text-pink-300" />
                  <span className="text-xs text-white/90">Premium Products</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3.5 py-1.5 rounded-full">
                  <MessageCircle className="w-4 h-4 text-green-300" />
                  <span className="text-xs text-white/90">24/7 Support</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3.5 py-1.5 rounded-full">
                  <Shield className="w-4 h-4 text-yellow-300" />
                  <span className="text-xs text-white/90">Secure Payments</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-auto">
              <div>
                <p className="text-xl lg:text-2xl font-bold text-white">50K+</p>
                <p className="text-xs text-white/60">Happy Customers</p>
              </div>
              <div>
                <p className="text-xl lg:text-2xl font-bold text-white">1M+</p>
                <p className="text-xs text-white/60">Products Sold</p>
              </div>
              <div>
                <p className="text-xl lg:text-2xl font-bold text-white">100+</p>
                <p className="text-xs text-white/60">Top Brands</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 overflow-y-auto h-full flex flex-col bg-background px-6 sm:px-8 lg:px-12">
          <div className="w-full max-w-md mx-auto my-auto py-8 md:py-12 flex flex-col">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-11 h-11 bg-primary/10 rounded-xl mb-3">
                <LayoutGrid className="w-5.5 h-5.5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-1.5">
                Welcome back
              </h1>
              <p className="text-muted-foreground text-sm">
                Sign in to continue your journey
              </p>
            </div>

            {/* Form */}
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground mb-1.5 block"
                >
                  Email address
                </label>
                <input
                  className="w-full px-4 py-2.5 bg-muted rounded-xl border border-transparent focus:border-ring focus:ring-2 focus:ring-ring/20 outline-none transition-all placeholder:text-muted-foreground text-sm"
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-danger mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground mb-1.5 block"
                >
                  Password
                </label>
                <input
                  className="w-full px-4 py-2.5 bg-muted rounded-xl border border-transparent focus:border-ring focus:ring-2 focus:ring-ring/20 outline-none transition-all placeholder:text-muted-foreground text-sm"
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-danger mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border text-primary focus:ring-ring"
                  />
                  <span className="text-sm text-muted-foreground">
                    Remember me
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isSubmitting || isLoading}
                className="mt-1"
              >
                Sign in
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">
                  or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-xl hover:bg-muted transition-colors cursor-pointer">
                <Globe className="w-4.5 h-4.5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Google
                </span>
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-xl hover:bg-muted transition-colors cursor-pointer">
                <Users className="w-4.5 h-4.5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  GitHub
                </span>
              </button>
            </div>

            {/* Footer */}
            <p className="text-center text-muted-foreground text-sm mt-5">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-primary font-medium hover:text-primary/80 transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

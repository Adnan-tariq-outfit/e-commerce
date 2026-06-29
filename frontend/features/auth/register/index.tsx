"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { RegisterFormType, registerSchema } from "./register.data";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRegisterMutation } from "@/services/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components";
import {
  LayoutGrid,
  Users,
  Globe,
  ShoppingBag,
  UserPlus,
  Camera,
  User,
  Mail,
  Lock,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function Register() {
  const [registerUser, { isLoading }] = useRegisterMutation();
  const router = useRouter();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormType): Promise<void> => {
    const { confirmPassword, ...rest } = data;
    toast.promise(
      registerUser({
        ...rest,
        avatar_url: imageFile ?? undefined,
      }).unwrap(),
      {
        loading: "Creating account...",
        success: () => {
          router.replace("/");
          return "Account created successfully!";
        },
        error: (err: any) => err?.data?.message || "Registration failed. Please try again.",
      }
    );
  };

  return (
    <div className="min-h-screen w-full flex p-0 md:p-4 justify-center bg-background md:bg-muted ">
      <div className="w-full h-[calc(100vh-2rem)] bg-background md:rounded-3xl md:shadow-lg md:border md:border-border flex flex-col md:flex-row overflow-hidden">
        {/* Left Side - Branding & Visual */}
        <div className="flex-1 relative hidden md:flex flex-col justify-between rounded-2xl overflow-hidden m-3">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-orange-600 to-amber-700" />

          {/* Decorative Circles */}
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

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
                Join our platform today
              </h2>
              <p className="text-white/80 text-base lg:text-lg mb-8">
                Create your account and discover the ultimate e-commerce experience tailored just for you.
              </p>

              {/* Benefits */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-yellow-300" />
                  </div>
                  <span className="text-sm text-white/90">Exclusive Member Discounts</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-pink-300" />
                  </div>
                  <span className="text-sm text-white/90">
                    Connect with premium sellers
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Globe className="w-4 h-4 text-cyan-300" />
                  </div>
                  <span className="text-sm text-white/90">
                    Free shipping worldwide
                  </span>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 lg:p-6 max-w-sm mt-auto">
              <p className="text-white/90 text-sm italic mb-4">
                &ldquo;This platform completely revolutionized how I shop online. The experience is incredibly seamless!&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">
                    Sarah Johnson
                  </p>
                  <p className="text-white/60 text-xs">Verified Customer</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="flex-1 overflow-y-auto h-full flex flex-col bg-background px-6 sm:px-8 lg:px-12">
          <div className="w-full max-w-md mx-auto my-auto py-8 md:py-12 flex flex-col">
            {/* Header */}
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-11 h-11 bg-primary/10 rounded-xl mb-3">
                <LayoutGrid className="w-5.5 h-5.5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-1.5">
                Create your account
              </h1>
              <p className="text-muted-foreground text-sm">
                Join thousands of happy customers today
              </p>
            </div>

            {/* Form */}
            <form
              className="flex flex-col gap-3.5"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* Full name */}
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-foreground mb-1 block"
                >
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
                  <input
                    className="w-full pl-11 pr-4 py-2.5 bg-muted rounded-xl border border-transparent focus:border-ring focus:ring-2 focus:ring-ring/20 outline-none transition-all placeholder:text-muted-foreground text-sm"
                    type="text"
                    id="name"
                    placeholder="John Doe"
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-danger mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground mb-1 block"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
                  <input
                    className="w-full pl-11 pr-4 py-2.5 bg-muted rounded-xl border border-transparent focus:border-ring focus:ring-2 focus:ring-ring/20 outline-none transition-all placeholder:text-muted-foreground text-sm"
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-danger mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground mb-1 block"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
                  <input
                    className="w-full pl-11 pr-4 py-2.5 bg-muted rounded-xl border border-transparent focus:border-ring focus:ring-2 focus:ring-ring/20 outline-none transition-all placeholder:text-muted-foreground text-sm"
                    type="password"
                    id="password"
                    placeholder="Create a strong password"
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-danger mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-foreground mb-1 block"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
                  <input
                    className="w-full pl-11 pr-4 py-2.5 bg-muted rounded-xl border border-transparent focus:border-ring focus:ring-2 focus:ring-ring/20 outline-none transition-all placeholder:text-muted-foreground text-sm"
                    type="password"
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    {...register("confirmPassword")}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-danger mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Profile Image */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">
                  Profile Image{" "}
                  <span className="text-muted-foreground font-normal text-xs">
                    (optional)
                  </span>
                </label>

                {/* Clickable avatar — opens hidden file input */}
                <div className="flex items-center gap-4">
                  <div
                    className="relative w-16 h-16 rounded-full cursor-pointer group flex-shrink-0"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-16 h-16 rounded-full object-cover border-2 border-border"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center">
                        <Camera className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-muted-foreground font-medium truncate max-w-[200px]">
                      {imageFile
                        ? imageFile.name
                        : "Click circle to upload photo"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      JPG, PNG, WebP or GIF · max 5 MB
                    </p>
                    {imageFile && (
                      <button
                        type="button"
                        className="text-[11px] text-danger hover:underline text-left"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Hidden file input — NOT registered with react-hook-form */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isLoading}
                className="mt-1"
              >
                Create Account
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">
                  or sign up with
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
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-medium hover:text-primary/80 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

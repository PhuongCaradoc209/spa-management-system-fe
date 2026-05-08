import React, { useState } from "react";
import AppButton from "@/components/common/AppButton";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { NAV_PATH } from "@/router/paths";
import { isAxiosError } from "axios";

type ApiErrorResponse = {
  message?: string;
};

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  // Tạo State lưu trữ dữ liệu form 
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 2. Cấu hình mutation gọi API register
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      // Nếu Backend báo thành công
      alert("Account created successfully! Please sign in.");
      navigate(NAV_PATH.LOGIN); // Chuyển khách về trang Login
    },
    onError: (error: unknown) => {
      // Nếu Backend báo lỗi (ví dụ: Email đã tồn tại)
      console.error(error);
      const apiMessage = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : undefined;

      alert(apiMessage || "Registration failed. Please try again!");
    },
  });

  // 3. Xử lý khi người dùng bấm nút "Create Account"
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn trình duyệt reload trang

    // Validate 1: Kiểm tra xem có ô nào bị bỏ trống không
    if (!fullName || !email || !password || !confirmPassword) {
      alert("Please fill in all fields!");
      return;
    }

    // Validate 2: Kiểm tra mật khẩu xác nhận có khớp không
    if (password !== confirmPassword) {
      alert("Passwords do not match. Please check again!");
      return;
    }

    // Xử lý tách Full Name thành firstName và lastName cho khớp với yêu cầu của API
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0]; 
    const lastName = nameParts.slice(1).join(" ") || " "; // Lấy phần còn lại làm lastName

    // mutation mang data đi gọi API
    registerMutation.mutate({
      email,
      password,
      firstName,
      lastName,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent pt-32 pb-16 px-6">
      <div className="max-w-md w-full animate-in zoom-in-95 duration-500">
        {/* Authentication Card */}
        <div className="auth-card-glass rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-12px_rgba(62,102,88,0.1)] border border-white/20">
          <div className="text-center mb-8">
            <h1 className="font-headline text-3xl font-bold tracking-tight text-primary mb-2">
              Create Account
            </h1>
            <p className="text-on-surface-variant font-medium text-sm">
              Begin your journey with us
            </p>
          </div>

          {/* Tabs */}
          <div className="flex p-1 bg-surface-container-low rounded-full mb-8">
            <AppButton
              variant="ghost"
              className="flex-1"
              size="sm"
              onClick={() => navigate(NAV_PATH.LOGIN)} 
            >
              Login
            </AppButton>
            <AppButton
              variant="secondary"
              className="flex-1 bg-white shadow-sm"
              size="sm"
            >
              Register
            </AppButton>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-[0.65rem] font-bold tracking-[0.15em] uppercase text-on-surface-variant ml-4">
                Full Name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant text-lg">
                  person
                </span>
                <input
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container/50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all placeholder:text-outline-variant text-primary"
                  placeholder="John Doe"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-[0.65rem] font-bold tracking-[0.15em] uppercase text-on-surface-variant ml-4">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant text-lg">
                  mail
                </span>
                <input
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container/50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all placeholder:text-outline-variant text-primary"
                  placeholder="curator@serenespa.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-[0.65rem] font-bold tracking-[0.15em] uppercase text-on-surface-variant ml-4">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant text-lg">
                  lock
                </span>
                <input
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container/50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all text-primary placeholder:text-outline-variant"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-[0.65rem] font-bold tracking-[0.15em] uppercase text-on-surface-variant ml-4">
                Confirm Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant text-lg">
                  lock_reset
                </span>
                <input
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container/50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all text-primary placeholder:text-outline-variant"
                  placeholder="••••••••"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Button Create Account */}
            <div className="pt-4">
              <AppButton
                variant="primary"
                fullWidth
                size="lg"
                type="submit"
                className="font-headline font-semibold tracking-wider text-sm shadow-lg shadow-primary/20"
              >
                Create Account
              </AppButton>
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <p className="text-xs text-on-surface-variant">
              Already have an account?
              <a
                className="font-bold text-tertiary hover:underline underline-offset-4 ml-1 cursor-pointer"
                onClick={() => navigate(NAV_PATH.LOGIN)}
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
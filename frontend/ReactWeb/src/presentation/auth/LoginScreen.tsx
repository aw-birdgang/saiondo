import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../constants";
import { useAuthStore } from "../../core/stores/authStore";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  // Test accounts
  const testAccounts = {
    male: { email: "kim@example.com", password: "password123" },
    female: { email: "lee@example.com", password: "password123" },
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError();
      await login(data.email, data.password);
      toast.success(t("auth.loginSuccess"));
      navigate(ROUTES.HOME, { replace: true });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("auth.loginError"),
      );
    }
  };

  const handleQuickLogin = async (accountType: "male" | "female") => {
    const account = testAccounts[accountType];
    try {
      clearError();
      await login(account.email, account.password);
      toast.success(t("auth.loginSuccess"));
      navigate(ROUTES.HOME, { replace: true });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("auth.loginError"),
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primaryContainer p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t("app.name")}</h1>
          <p className="text-white/80">로그인하여 시작하세요</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("auth.email")}
              </label>
              <input
                {...register("email", {
                  required: t("auth.emailRequired"),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t("auth.invalidEmail"),
                  },
                })}
                type="email"
                id="email"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={t("auth.email")}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("auth.password")}
              </label>
              <div className="relative">
                <input
                  {...register("password", {
                    required: t("auth.passwordRequired"),
                    minLength: {
                      value: 6,
                      message: "비밀번호는 최소 6자 이상이어야 합니다.",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="비밀번호를 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-primaryContainer"
              }`}
            >
              {isLoading ? t("common.loading") : t("auth.login")}
            </button>

            {/* Test Account Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("male")}
                disabled={isLoading}
                className="w-full py-2 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                남성 테스트 계정으로 로그인
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("female")}
                disabled={isLoading}
                className="w-full py-2 px-4 rounded-lg font-medium text-white bg-pink-600 hover:bg-pink-700 transition-colors"
              >
                여성 테스트 계정으로 로그인
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">또는</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              계정이 없으신가요?{" "}
              <Link
                to={ROUTES.REGISTER}
                className="text-primary hover:text-primaryContainer font-medium"
              >
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;

import { useNavigate } from "react-router-dom";
import UseForm from "../hooks/UseForm";
import { UserSigninInformation, validateSignin } from "../utils/validate";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import useLogin from "../hooks/mutation/useLogin"; // ✅ 추가

const LoginPage = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const { values, errors, touched, getInputProps } =
    UseForm<UserSigninInformation>({
      initialValue: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const loginMutation = useLogin(); // ✅ useMutation 훅 사용

  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  }, [accessToken]);

  const handleSubmit = () => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        navigate("/mypage");
      },
      onError: (error) => {
        if (error instanceof Error) {
          alert("로그인 실패");
          console.error(error);
        } else {
          alert("알 수 없는 오류가 발생했습니다.");
          console.error("Unknown error:", error);
        }
      },
    });
  };

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

  const handleGoogleLogin = () => {
    window.location.href =
      import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  };

  return (
    <div className="bg-black flex items-center justify-center px-4 py-[5%]">
      <div className="w-full max-w-sm space-y-6 text-center">
        <h2 className="text-2xl font-bold text-white">로그인</h2>

        <button
          className="flex items-center justify-center w-full border border-gray-300 rounded py-2 hover:bg-gray-300 transition text-gray-300 hover:text-black cursor-pointer"
          onClick={handleGoogleLogin}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          <span className="text-sm">구글 로그인</span>
        </button>

        <div className="flex items-center justify-between text-gray-400 text-sm">
          <hr className="flex-1 border-gray-200" />
          <span className="px-2">OR</span>
          <hr className="flex-1 border-gray-200" />
        </div>

        <div className="flex flex-col gap-3">
          <input
            {...getInputProps("email")}
            type="email"
            placeholder="이메일"
            className={`p-2 border rounded w-full text-sm text-gray-300 ${
              errors?.email && touched?.email
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {errors?.email && touched?.email && (
            <p className="text-red-500 text-sm text-left">{errors.email}</p>
          )}

          <input
            {...getInputProps("password")}
            type="password"
            placeholder="비밀번호"
            className={`p-2 border rounded w-full text-sm text-gray-300 ${
              errors?.password && touched?.password
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {errors?.password && touched?.password && (
            <p className="text-red-500 text-sm text-left">{errors.password}</p>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled || loginMutation.isPending}
          className="w-full bg-blue-600 text-white py-2 rounded cursor-pointer text-sm font-medium transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loginMutation.isPending ? "로그인 중..." : "로그인"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

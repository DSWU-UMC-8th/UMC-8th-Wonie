import UseForm from "../hooks/UseForm";
import { UserSigninInformation, validateSignin } from "../utils/validate";
import { postSignin } from "../apis/auth";
import { ResponseSigninDto } from "../types/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import useLocalStorage from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { setItem } = useLocalStorage();
  const navigate = useNavigate();
  const { values, errors, touched, getInputProps } =
    UseForm<UserSigninInformation>({
      initialValue: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const handleSubmit = async () => {
    try {
      const response: ResponseSigninDto = await postSignin(values);
      setItem(LOCAL_STORAGE_KEY.accessToken, response.data.accessToken);
      alert("로그인 성공!");
      console.log(response);
      navigate("/mypage");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
        console.error(error);
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
        console.error("Unknown error:", error);
      }
    }
  };

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <h2 className="text-2xl font-bold text-white">로그인</h2>

        <button className="flex items-center justify-center w-full border border-gray-300 rounded py-2 hover:bg-gray-300 transition text-gray-300 hover:text-black">
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
          disabled={isDisabled}
          className="w-full bg-blue-600 text-white py-2 rounded cursor-pointer text-sm font-medium transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

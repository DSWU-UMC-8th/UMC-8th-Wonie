import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSignup } from "../apis/auth";
import { useNavigate } from "react-router-dom";

const schema = z
  .object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하이어야 합니다." }),
    passwordCheck: z.string(),
    name: z.string().min(1, { message: "이름을 입력해주세요." }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const email = watch("email");
  const password = watch("password");
  const passwordCheck = watch("passwordCheck");
  const name = watch("name");
  const navigate = useNavigate();

  const isValid =
    email &&
    password &&
    passwordCheck &&
    name &&
    !errors.email &&
    !errors.password &&
    !errors.passwordCheck &&
    !errors.name;

  const onSubmit = async (data: FormFields) => {
    const { passwordCheck, ...rest } = data;
    try {
      const response = await postSignup({
        ...rest,
        bio1: "",
        bio2: "",
        avatar: "",
      });
      alert("회원가입 완료!");
      console.log(response);
      navigate("/login");
    } catch (err) {
      alert("회원가입 실패");
      console.error(err);
    }
  };

  return (
    <div className="text-white flex flex-col items-center justify-center px-4 py-[5%]">
      <div className="w-full max-w-sm text-center space-y-6">
        <h2 className="text-2xl font-bold">회원가입</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            {...register("email")}
            type="email"
            placeholder="이메일"
            className="p-2 rounded border border-gray-300 bg-white text-gray-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호"
              className="w-full p-2 rounded border border-gray-300 bg-white text-gray-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-2 text-sm text-gray-500"
            >
              {showPassword ? "숨김" : "보기"}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password?.message}</p>
            )}
          </div>

          <div className="relative">
            <input
              {...register("passwordCheck")}
              type={showPasswordCheck ? "text" : "password"}
              placeholder="비밀번호 확인"
              className="w-full p-2 rounded border border-gray-300 bg-white text-gray-500"
            />
            <button
              type="button"
              onClick={() => setShowPasswordCheck((prev) => !prev)}
              className="absolute right-2 top-2 text-sm text-gray-500"
            >
              {showPasswordCheck ? "숨김" : "보기"}
            </button>
          </div>
          {errors.passwordCheck && (
            <p className="text-red-500 text-sm">
              {errors.passwordCheck?.message}
            </p>
          )}

          <input
            {...register("name")}
            placeholder="닉네임"
            className="p-2 rounded border border-gray-300 bg-white text-gray-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}

          <button
            type="submit"
            disabled={!isValid}
            className="bg-blue-600 cursor-pointer text-white py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;

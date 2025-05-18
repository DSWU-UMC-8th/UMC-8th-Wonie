import { axiosInstance } from "../apis/axios";

import { LOCAL_STORAGE_KEY } from "../constants/key";

import {
  RequestSigninDto,
  RequestSignupDto,
  ResponseSigninDto,
  ResponseSignupDto,
  ResponseMyInfoDto,
} from "../types/auth";

// 회원가입 API
export const postSignup = async (
  body: RequestSignupDto
): Promise<ResponseSignupDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signup", body);
  return data;
};

// 로그인 API
export const postSignin = async (
  body: RequestSigninDto
): Promise<ResponseSigninDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signin", body);
  return data;
};

// 내 정보 조회 API
export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  const { data } = await axiosInstance.get("/v1/users/me");
  return data;
};

export const postLogout = async () => {
  const { data } = await axiosInstance.post("/v1/auth/signout");

  return data;
};

export const updateMyInfo = async ({
  name,
  bio,
  avatar,
}: {
  name: string;
  bio?: string;
  avatar?: string;
}) => {
  const { data } = await axiosInstance.patch("/v1/users", {
    name,
    bio,
    avatar,
  });
  return data;
};

export const postWithdraw = async () => {
  const { data } = await axiosInstance.delete("/v1/users");
  return data;
};

export const patchMyInfo = async ({
  name,
  bio,
  avatar,
}: {
  name: string;
  bio: string;
  avatar: string;
}) => {
  return axiosInstance.patch("/v1/users/me", {
    name,
    bio,
    avatar,
  });
};

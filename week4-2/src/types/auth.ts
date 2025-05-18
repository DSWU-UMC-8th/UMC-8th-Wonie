import { CommonResponse } from "./common";

export type RequestSignupDto = {
  name: string;
  email: string;
  password: string;
  bio1: string;
  bio2: string;
  avatar?: string; // 프로필 이미지 URL (선택)
};

export type ResponseSignupDto = CommonResponse<{
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}>;

export type ResponseMyInfoDto = CommonResponse<{
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}>;

export type RequestSigninDto = {
  email: string;
  password: string;
};

export type ResponseSigninDto = CommonResponse<{
  id: number;
  name: string;
  accessToken: string;
  refreshToken: string;
}>;

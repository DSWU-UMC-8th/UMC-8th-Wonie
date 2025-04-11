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
  
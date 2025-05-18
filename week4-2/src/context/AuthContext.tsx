import { createContext, useState, useContext, PropsWithChildren } from "react";
import { RequestSigninDto } from "../types/auth";
import { postSignin, postLogout } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import useLocalStorage from "../hooks/useLocalStorage";
import { ResponseMyInfoDto } from "../types/auth";

// AuthContext 타입 정의
/*interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (signInData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
}*/

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (signInData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
  user: ResponseMyInfoDto["data"] | null;
  setUser: React.Dispatch<
    React.SetStateAction<ResponseMyInfoDto["data"] | null>
  >;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const {
    getItem: getAccessTokenFromStorage,
    setItem: setAccessTokenToStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

  // refreshToken 관련
  const {
    getItem: getRefreshTokenFromStorage,
    setItem: setRefreshTokenToStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessTokenFromStorage()
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    getRefreshTokenFromStorage()
  );
  const [user, setUser] = useState<ResponseMyInfoDto["data"] | null>(null);

  const login = async (signInData: RequestSigninDto) => {
    try {
      const { data } = await postSignin(signInData);

      if (data) {
        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;

        setAccessTokenToStorage(newAccessToken);
        setRefreshTokenToStorage(newRefreshToken);
        // 상태 업데이트
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        alert("로그인 성공");
        window.location.href = "/my";
      }
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  const logout = async () => {
    try {
      await postLogout();

      setAccessToken(null);
      setRefreshToken(null);

      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();
      alert("로그아웃 성공");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 실패");
    }
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, login, logout, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Context 사용 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext를 찾을 수 없습니다.");
  }

  return context;
};

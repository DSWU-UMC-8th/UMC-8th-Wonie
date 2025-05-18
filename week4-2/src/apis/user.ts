import { axiosInstance } from "./axios";

// 유저 정보 수정
export const patchMyInfo = async (formData: FormData) => {
  const res = await axiosInstance.patch("/v1/users", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};


export const deleteUser = async () => {
  const res = await axiosInstance.delete("/v1/users");
  return res.data;
};

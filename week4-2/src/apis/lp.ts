import { PaginationDto } from "../types/common.ts";
import {
  LpDetail,
  ResponseCommentListDto,
  ResponseLpListDto,
  RequestLpDto,
  ResponseLikeLpDto,
} from "../types/lp.ts";
import { axiosInstance } from "./axios.ts";

export const getLpList = async (
  paginationDto: PaginationDto
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: paginationDto,
  });

  return data;
};

export const getLpDetail = async (id: number): Promise<LpDetail> => {
  const { data } = await axiosInstance.get(`/v1/lps/${id}`);
  return data;
};

export const getCommentList = async (
  lpId: number,
  params: { cursor?: number; order: "asc" | "desc" }
): Promise<ResponseCommentListDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params,
  });
  return data;
};

export const postLike = async ({
  lpId,
}: RequestLpDto): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.post(`v1/lps/${lpId}/likes`);

  return data;
};

export const deleteLike = async ({ lpId }: RequestLpDto) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);

  return data;
};

export const postLp = async (lpData: {
  title: string;
  content: string;
  tags: string[];
  thumbnail: string;
  published: boolean;
}) => {
  const { data } = await axiosInstance.post("/v1/lps", lpData);
  return data;
};

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axiosInstance.post("/v1/uploads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data.data.imageUrl; // 서버 응답 구조에 따라 수정
};

export const deleteLp = async (lpId: number | string) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`);
  return data;
};

export const patchLp = async ({
  lpId,
  title,
  content,
}: {
  lpId: number;
  title: string;
  content: string;
}) => {
  const { data } = await axiosInstance.patch(`/v1/lps/${lpId}`, {
    title,
    content,
  });
  return data;
};

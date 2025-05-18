
import { axiosInstance } from "./axios";

export const postComment = async ({
  lpId,
  content,
}: {
  lpId: number;
  content: string;
}) => {
  const res = await axiosInstance.post(`/v1/lps/${lpId}/comments`, { content });
  return res.data;
};
export const patchComment = async ({
  lpId,
  commentId,
  content,
}: {
  lpId: number;
  commentId: number;
  content: string;
}) => {
  const res = await axiosInstance.patch(
    `/v1/lps/${lpId}/comments/${commentId}`,
    { content }
  );
  return res.data;
};

// 댓글 삭제
export const deleteComment = async ({
  lpId,
  commentId,
}: {
  lpId: number;
  commentId: number;
}) => {
  const res = await axiosInstance.delete(
    `/v1/lps/${lpId}/comments/${commentId}`
  );
  return res.data;
};
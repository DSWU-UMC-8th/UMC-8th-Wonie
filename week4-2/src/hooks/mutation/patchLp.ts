import { axiosInstance } from "../axios";
import { UpdateLpRequest } from "../types/lp";

export const patchLp = async (data: UpdateLpRequest) => {
  const { lpId, ...body } = data;
  return axiosInstance.patch(`/v1/lps/${lpId}`, body);
};

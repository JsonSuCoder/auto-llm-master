import { request, buildUrl } from "./request";

export interface QueryTypeItem {
  id?: string;
  code: string;
  L1_SCENE_ID: string;
  L2_SCENE_ID: string;
  L3_SCENE_ID: string;
  createdAt?: string;
  description: string;
  guidance: string;
  prompt: string;
  distilledPrompt: string;
  qualityStandard: string;
}

export const getQueryTypes = ({ page, size }: { page: number; size: number }) => {
  return request(buildUrl(`/querytypes?page=${page}&size=${size}`), {
    method: "GET",
  });
};

export const getAllQueryTypes = () => {
  return request(buildUrl("/querytypes/all"), {
    method: "GET",
  });
};

export const createQueryTypes = (query: QueryTypeItem) => {
  return request(buildUrl("/querytypes"), {
    method: "POST",
    body: query,
  });
};

export const updateQueryTypes = (queryId: string, updatedQueryData: any) => {
  return request(buildUrl(`/querytypes/${queryId}`), {
    method: "PUT",
    body: updatedQueryData,
  });
};

export const deleteQueryTypes = (queryId: string) => {
  return request(buildUrl(`/querytypes/${queryId}`), {
    method: "DELETE",
  });
};

import { request } from "./request";
export const getQueries = ({
  page,
  size,
  manual_confirmed,
}: {
  page: number;
  size: number;
  manual_confirmed: string;
}) => {
  let requestUrl = `/queries?page=${page}&size=${size}`;
  if (manual_confirmed) {
    requestUrl += `&manual_confirmed=${manual_confirmed}`;
  }

  return request(requestUrl, {
    method: "GET",
  });
};

export const patchQueryStatus = (id: string, status: string) => {
  return request(`/queries/${id}/manual-confirmed`, {
    method: "PATCH",
    body: {
      manual_confirmed:status,
    },
  });
};

// 生成queries

export const createQueries = (queries: any) => {
  return request("/queries", {
    method: "POST",
    body: queries,
  });
};
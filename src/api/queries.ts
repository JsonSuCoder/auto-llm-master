import { request, buildUrl } from "./request";
export const getQueries = ({
  page,
  size,
  manual_confirmed,
}: {
  page: number;
  size: number;
  manual_confirmed: string;
}) => {
  let endpoint = `/queries?page=${page}&size=${size}`;
  if (manual_confirmed) {
    endpoint += `&manual_confirmed=${manual_confirmed}`;
  }

  return request(buildUrl(endpoint), {
    method: "GET",
  });
};

export const patchQueryStatus = (id: string, status: string) => {
  return request(buildUrl(`/queries/${id}/manual-confirmed`), {
    method: "PATCH",
    body: {
      manual_confirmed:status,
    },
  });
};

// 生成queries

export const generateQueries = (queries: any) => {
  return request('https://llm.sending.network/generate/generate-queries', {
    method: "POST",
    body: queries,
  });
};
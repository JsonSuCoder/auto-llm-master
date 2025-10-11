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
      manual_confirmed: status,
    },
  });
};

// 生成queries
export const generateQueries = (queries: any) => {
  return request("https://llm.sending.network/generate/generate-queries", {
    method: "POST",
    body: queries,
  });
};

// 查询未评分的数量
export const getUnfilteredQueryCount = (querytype_id: number) => {
  return request(buildUrl(`/queries/unfiltered-count?querytype_id=${querytype_id}`), {
    method: "GET",
  });
};

// 开始评分
export const startFilteringQueries = (data: {
  querytype_id: number;
  filter_count: number;
  passing_score: number;
}) => {
  return request("https://llm.sending.network/filter/start", {
    method: "POST",
    body: data,
  });
};

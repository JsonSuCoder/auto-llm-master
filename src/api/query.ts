import { SEVER_URL } from "./config";

export const L1_SCENE = {
  A: {
    title: "综合 (General)",
  },
  B: {
    title: "叙事驱动 (Narrative)",
  },
  C: {
    title: "宏观驱动 (Macro-Driven)",
  },
  D: {
    title: "基本面驱动 (Fundamental)",
  },
  E: {
    title: "链上/数据驱动 (On-Chain/Data)",
  },
  F: {
    title: "量化/套利驱动 (Quant/Arbitrage)",
  },
};

export const L2_SCENE = {
  T1: {
    title: "综合 (General)",
  },
  T2: {
    title: "主流蓝筹 (Blue-Chip)",
  },
  T3: {
    title: "基础设施 (Infrastructure)",
  },
  T4: {
    title: "VC币",
  },
  T5: {
    title: "DeFi (Decentralized Finance)",
  },
};

export const L3_SCENE = {
  H1: {
    title: "综合 (General)",
  },
  H2: {
    title: "主流蓝筹 (Blue-Chip)",
  },
  H3: {
    title: "基础设施 (Infrastructure)",
  },
  H4: {
    title: "VC币",
  },
  H5: {
    title: "DeFi (Decentralized Finance)",
  },
};

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
  return new Promise((resolve) => {
    fetch(`${SEVER_URL}/querytypes?page=${page}&size=${size}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      });
  });
};

export const getAllQueryTypes = () => {
  return new Promise((resolve) => {
    fetch(`${SEVER_URL}/querytypes/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      });
  });
};

export const createQueryTypes = (query: QueryTypeItem) => {
  return new Promise((resolve) => {
    fetch(`${SEVER_URL}/querytypes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      });
  });
};

export const updateQueryTypes = (queryId: string, updatedQueryData: any) => {
  return new Promise((resolve) => {
    fetch(`${SEVER_URL}/querytypes/${queryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedQueryData),
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      });
  });
};

export const deleteQueryTypes = (queryId: string) => {
  return new Promise((resolve) => {
    fetch(`${SEVER_URL}/querytypes/${queryId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      });
  });
};

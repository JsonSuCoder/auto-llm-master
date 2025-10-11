import { request, setUserInfo } from "./request";

export type User = {
  id?: string;
  name: string;
  email: string;
  password?: string;
  is_active?: boolean;
  role: "admin" | "producer";
};

export const onLogin = async (email: string, password: string) => {
  const data: any = await request("/users/login", {
    method: "POST",
    body: { email, password },
  });

  if (data.user) {
    setUserInfo(data.user);
  }

  return data;
};

export const getUsers = () => {
  return request("/users/", {
    method: "GET",
  });
};

export const createUser = (user: User): Promise<any> => {
  return request("/users", {
    method: "POST",
    body: user,
  });
};

export const deleteUser = (userId: string): Promise<any> => {
  return request(`/users/${userId}`, {
    method: "DELETE",
  });
};

export const updateUser = (
  userId: string,
  updatedUserData: any
): Promise<any> => {
  return request(`/users/${userId}`, {
    method: "PUT",
    body: updatedUserData,
  });
};

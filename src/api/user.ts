export const SEVER_URL = "http://localhost:8000";

export type User = {
  id?: string;
  name: string;
  email: string;
  password?: string;
  is_active?: boolean;
  role: "admin" | "producer";
};
export const onLogin = (email: string, password: string) => {
  // Implement your own login logic here
  return new Promise((resolve) => {
    fetch(`${SEVER_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      });
  });
};

export const getUsers = () => {
  return new Promise((resolve) => {
    fetch(`${SEVER_URL}/users/`, {
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

export const createUser = (user: User): Promise<any> => {
  return new Promise((resolve) => {
    fetch(`${SEVER_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      });
  });
};

export const deleteUser = (userId: string): Promise<any> => {
  // Implement your own delete user logic here
  return new Promise((resolve) => {
    fetch(`${SEVER_URL}/users/${userId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      });
  });
};

export const updateUser = (
  userId: string,
  updatedUserData: any
): Promise<any> => {
  // Implement your own update user logic here
  return new Promise((resolve) => {
    fetch(`${SEVER_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUserData),
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      });
  });
};

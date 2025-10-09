export const SEVER_URL = 'http://localhost:8000';
export const onLogin = (email: string, password: string) => {
  // Implement your own login logic here
  return new Promise((resolve, reject) => {
    fetch(`${SEVER_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
  });
};
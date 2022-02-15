export const get = async <T>(url = '', params?: T, token?: string): Promise<Response> => {
  const request: RequestInit = {
    method: 'GET',
  };

  if (token) {
    request.headers = {
      ...request.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return fetch(`${process.env.API_URL}${url}`, request);
};

export const post = async <T>(url = '', body: T, token?: string): Promise<Response> => {
  const request: RequestInit = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  if (token) {
    request.headers = {
      ...request.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return fetch(`${process.env.API_URL}${url}`, request);
};

export const put = async <T>(url = '', body: T, token?: string): Promise<Response> => {
  const request: RequestInit = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  if (token) {
    request.headers = {
      ...request.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return fetch(`${process.env.API_URL}${url}`, request);
};

// export const del = async (params: any, url = ''): Promise<Response> => {
//   const promise = fetch(`http://127.0.0.1:3000/${url}`, {
//     method: 'DELETE',
//   });

//   return promise;
// };

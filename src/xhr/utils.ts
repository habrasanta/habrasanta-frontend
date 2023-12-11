import { User } from "../models";

export const getRequest = async (apiUrl: string) => {
  try {
    const res = await fetch(apiUrl);

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return await res.json();
  } catch (error) {
    throw error;
  }
}

export const postRequest = async (apiUrl: string, user: User, data?: unknown) => {
  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": user.csrf_token,
      },
      body: data ? JSON.stringify(data) : '',
    });
  
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return await res.json();
  } catch (error) {
    throw error;
  }
}

export const deleteRequest = async (apiUrl: string, user: User) => {
  try {
    const res = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": user.csrf_token,
      },
    });
  
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return await res.json();
  } catch (error) {
    throw error;
  }
}

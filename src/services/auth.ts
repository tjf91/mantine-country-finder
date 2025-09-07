const authAPI = import.meta.env.VITE_AUTH_API_KEY;
const authURL = import.meta.env.VITE_AUTH_URL;
export interface AuthResponse {
  access_token: string;
}
export async function getAuthToken(): Promise<AuthResponse> {
  const apiUrl = `${authURL}/access_token`;
  const headers = {
    "Content-Type": "application/json",
    "Api-Key": authAPI,
  };

  try {
    const res = await fetch(apiUrl, {
      headers,
      method: "POST",
      body: JSON.stringify({ corporate_id: 10 }),
    });
    console.log("res", res);
    if (!res.ok) {
      throw new Error(`Error fetching auth token: ${res.statusText}`);
    }
    const data: AuthResponse = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching auth token:", error);
    throw error;
  }
}

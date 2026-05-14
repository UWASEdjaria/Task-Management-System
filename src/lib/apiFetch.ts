import { ApiResponse, FetchOptions } from "../types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
 

export const apiFetch = async <T> (endpoint: string, options: FetchOptions = {}) : Promise<ApiResponse<T>> => {
  const { method = "GET", headers, body, ...rest } = options;

  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : undefined;
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  };

  try {
   console.log(`Fetching: ${BASE_URL}${endpoint}`);
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
   
    // Check if the response is actually JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textError = await response.text();
      console.error("Expected JSON, but received HTML. Preview:", textError.slice(0, 200));
      return { 
        success: false, 
        message: "Server returned an invalid response. Check the URL or Port." ,
        data: null as T
      };
    }

    const data = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        message: data.message || "An error occurred" ,
        data: data.data || (data as T)
      };
    }

    return { 
      success: true, ...data,
      message: data.message || "Success",
      data: data.data || data};

  } catch (error) {
    console.error("Network or API Error:", error);
    return { 
      success: false, 
      message: "Network error. Please ensure the backend server is running." ,
      data: null as T
    };
  }
};
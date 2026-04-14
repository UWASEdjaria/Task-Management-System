const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const apiFetch = async (endpoint: string, options: any = {}) => {
  const { method = "GET", headers, body, ...rest } = options;

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
    console.log(`${BASE_URL}${endpoint}`)
    console.log(`${BASE_URL}`)
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
   
    // Check if the response is actually JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textError = await response.text();
      console.error("Expected JSON, but received HTML. Preview:", textError.slice(0, 200));
      return { 
        success: false, 
        message: "Server returned an invalid response. Check the URL or Port." 
      };
    }

    const data = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        message: data.message || "An error occurred" 
      };
    }

    return { success: true, ...data };

  } catch (error) {
    console.error("Network or API Error:", error);
    return { 
      success: false, 
      message: "Network error. Please ensure the backend server is running." 
    };
  }
};
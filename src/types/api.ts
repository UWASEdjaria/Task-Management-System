export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;// This "T" is a placeholder for whatever you are fetching
    token?: string;

}
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface FetchOptions {
    method?: HttpMethod;
    headers?: Record<string, string>;
    body?: object; // Use 'object' instead of 'any' or 'unknown'
    cache?: RequestCache;
}
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;// This "T" is a placeholder for whatever you are fetching
    token?: string;

}
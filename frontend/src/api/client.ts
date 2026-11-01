export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const BASE_URL = import.meta.env.VITE_API_URL || '';

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, options);

  if (!response.ok) {
    let errorData: unknown = null;
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      errorData = await response.json();
      if (typeof errorData === 'object' && errorData !== null) {
        if ('detail' in errorData && typeof (errorData as { detail: unknown }).detail === 'string') {
          errorMessage = (errorData as { detail: string }).detail;
        } else if ('message' in errorData && typeof (errorData as { message: unknown }).message === 'string') {
          errorMessage = (errorData as { message: string }).message;
        }
      }
    } catch {
      // response is not JSON
    }
    throw new ApiError(response.status, errorMessage, errorData);
  }

  // Handle empty or file responses
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json() as Promise<T>;
  }
  return response.text() as unknown as Promise<T>;
}


import { authClient } from './auth-client';

// Base API configuration
const API_BASE = '/api';

// Helper function to get auth headers
const getAuthHeaders = async () => {
  try {
    const session = await authClient.getSession();
    if (session && typeof session === 'object' && 'session' in session) {
      const sessionData = (session as any).session;
      return {
        'Authorization': `Bearer ${sessionData?.token}`,
        'Content-Type': 'application/json',
      };
    }
  } catch (error) {
    console.error('Error getting auth headers:', error);
  }
  
  return {
    'Content-Type': 'application/json',
  };
};

// Generic API request function
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE}${endpoint}`;
  const headers = await getAuthHeaders();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Profile API functions
export const profileApi = {
  // Get profile by ID
  getById: (id: string) => 
    apiRequest(`/profiles/${id}`),
  
  // Get current user's profile
  getCurrent: () => 
    apiRequest('/profiles/me'),
  
  // Update profile
  update: (id: string, data: Partial<{
    name: string;
    email: string;
    image: string;
  }>) => 
    apiRequest(`/profiles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  // Get multiple profiles by IDs
  getMultiple: async (ids: string[]) => {
    const profiles = await Promise.all(
      ids.map(id => profileApi.getById(id))
    );
    return profiles;
  },
};

// User API functions
export const userApi = {
  // Get current user session
  getCurrent: () => 
    apiRequest('/auth/session'),
  
  // Sign out
  signOut: () => 
    apiRequest('/auth/sign-out', { method: 'POST' }),
};

// Export the base API request for custom endpoints
export { apiRequest as default };

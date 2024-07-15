// src/config/apiConfig.ts

// Define a type for API configurations
export interface ApiConfig {
    baseUrl: string;
    timeout: number; // Timeout in milliseconds
  }
  
  // API configurations
  export const apiConfig: ApiConfig = {
    baseUrl: 'https://api.yourproject.com', // Replace with your API base URL
    timeout: 10000, // 10 seconds timeout
  };
  
  // Export types for use in other files
  
  
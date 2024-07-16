// Utility functions for handling JWTs

// Define a constant for the token key used in local storage
const TOKEN_KEY = 'authToken';

/**
 * Gets the JWT token from local storage.
 * @returns {string | null} The JWT token or null if it doesn't exist.
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Sets the JWT token in local storage.
 * @param {string} token - The JWT token to be stored.
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Removes the JWT token from local storage.
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Validates the JWT token. In a real application, this would involve checking
 * the token's expiration and potentially its signature. This is a simple placeholder.
 * @param {string} token - The JWT token to be validated.
 * @returns {boolean} True if the token is valid, false otherwise.
 */
export function isValidToken(token: string): boolean {
  // Placeholder: Token validation logic should be more robust.
  // Example validation could include checking token expiration and structure.
  
  try {
    // Split token to extract payload and verify signature if needed.
    const [header, payload, signature] = token.split('.');
    
    // Basic check: Ensure token has 3 parts (header, payload, signature)
    if (!header || !payload || !signature) {
      return false;
    }

    // Decode payload and check expiration
    const decodedPayload = JSON.parse(atob(payload));
    const currentTime = Math.floor(Date.now() / 1000);

    // Check if token is expired
    if (decodedPayload.exp && decodedPayload.exp < currentTime) {
      return false;
    }

    // Further validation (e.g., signature check) can be added here.

    return true;
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
}

/**
 * Password Policy Service
 * 
 * This service provides utilities for enforcing password policies.
 * It integrates with Auth0 to enforce password requirements.
 */

/**
 * Password policy configuration
 */
export interface PasswordPolicyConfig {
  // Minimum password length
  minLength: number;
  // Require at least one lowercase letter
  requireLowercase: boolean;
  // Require at least one uppercase letter
  requireUppercase: boolean;
  // Require at least one number
  requireNumber: boolean;
  // Require at least one special character
  requireSpecialChar: boolean;
  // Maximum password age in days (0 = no expiration)
  maxAge: number;
}

// Default password policy based on NIST guidelines
export const DEFAULT_PASSWORD_POLICY: PasswordPolicyConfig = {
  minLength: 12,
  requireLowercase: true,
  requireUppercase: true,
  requireNumber: true,
  requireSpecialChar: true,
  maxAge: 90, // 90 days
};

/**
 * Check if a password meets the policy requirements
 * 
 * @param password Password to check
 * @param policy Policy configuration to check against
 * @returns Object with validation result and messages
 */
export function validatePassword(
  password: string,
  policy: PasswordPolicyConfig = DEFAULT_PASSWORD_POLICY
): { valid: boolean; messages: string[] } {
  const messages: string[] = [];
  
  // Check length
  if (password.length < policy.minLength) {
    messages.push(`Password must be at least ${policy.minLength} characters long`);
  }
  
  // Check for lowercase letter
  if (policy.requireLowercase && !/[a-z]/.test(password)) {
    messages.push('Password must contain at least one lowercase letter');
  }
  
  // Check for uppercase letter
  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    messages.push('Password must contain at least one uppercase letter');
  }
  
  // Check for number
  if (policy.requireNumber && !/[0-9]/.test(password)) {
    messages.push('Password must contain at least one number');
  }
  
  // Check for special character
  if (policy.requireSpecialChar && !/[^A-Za-z0-9]/.test(password)) {
    messages.push('Password must contain at least one special character');
  }
  
  return {
    valid: messages.length === 0,
    messages
  };
}

/**
 * Get Auth0 password policy rules in a format suitable for client-side validation
 * 
 * @returns Password policy rules
 */
export function getPasswordPolicyRules(): PasswordPolicyConfig {
  // In a real app, this would be retrieved from Auth0 Management API
  // or environment variables
  return DEFAULT_PASSWORD_POLICY;
}

/**
 * Generate a strong password that meets policy requirements
 * 
 * @param policy Policy configuration to meet
 * @returns A strong random password
 */
export function generateStrongPassword(
  policy: PasswordPolicyConfig = DEFAULT_PASSWORD_POLICY
): string {
  const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';
  
  let allChars = '';
  let password = '';
  
  // Add required character types
  if (policy.requireLowercase) {
    allChars += lowerChars;
    password += lowerChars.charAt(Math.floor(Math.random() * lowerChars.length));
  }
  
  if (policy.requireUppercase) {
    allChars += upperChars;
    password += upperChars.charAt(Math.floor(Math.random() * upperChars.length));
  }
  
  if (policy.requireNumber) {
    allChars += numbers;
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  if (policy.requireSpecialChar) {
    allChars += specialChars;
    password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
  }
  
  // Fill the rest of the password with random characters
  const remainingLength = policy.minLength - password.length;
  
  for (let i = 0; i < remainingLength; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  
  // Shuffle the password characters
  return password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
}

/**
 * Check if a password should be changed based on age
 * 
 * @param lastChangedDate Date the password was last changed
 * @param policy Policy configuration to check against
 * @returns Whether the password should be changed
 */
export function shouldChangePassword(
  lastChangedDate: Date,
  policy: PasswordPolicyConfig = DEFAULT_PASSWORD_POLICY
): boolean {
  // If no max age, password never expires
  if (policy.maxAge === 0) {
    return false;
  }
  
  const now = new Date();
  const daysSinceChange = Math.floor(
    (now.getTime() - lastChangedDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  return daysSinceChange >= policy.maxAge;
} 
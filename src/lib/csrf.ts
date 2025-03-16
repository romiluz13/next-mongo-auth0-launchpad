/**
 * CSRF Protection Utility
 * 
 * This module provides utilities for generating and validating CSRF tokens
 * to protect against Cross-Site Request Forgery attacks.
 */

import { randomBytes, createHash } from 'crypto';
import { cookies } from 'next/headers';
import { logger } from './logger';

// CSRF token cookie name
const CSRF_COOKIE_NAME = 'mongodb-csrf';
// CSRF secret key used to sign tokens
const CSRF_SECRET = process.env.CSRF_SECRET || 'default-csrf-secret-key';
// CSRF token expiration time (2 hours)
const CSRF_EXPIRY = 2 * 60 * 60 * 1000;

/**
 * Generate a CSRF token
 * 
 * @returns {string} CSRF token
 */
export function generateCsrfToken(): string {
  try {
    // Generate a random token
    const randomToken = randomBytes(32).toString('hex');
    // Get the current timestamp
    const timestamp = Date.now().toString();
    // Create a signature using HMAC
    const signature = createHash('sha256')
      .update(`${randomToken}${timestamp}${CSRF_SECRET}`)
      .digest('hex');
    
    // Create the complete token
    const csrfToken = `${randomToken}.${timestamp}.${signature}`;
    
    // Store the token in a HttpOnly cookie
    const cookieStore = cookies();
    cookieStore.set({
      name: CSRF_COOKIE_NAME,
      value: csrfToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: CSRF_EXPIRY / 1000 // Convert to seconds
    });
    
    return csrfToken;
  } catch (error) {
    logger.error('Error generating CSRF token:', error);
    return '';
  }
}

/**
 * Validate a CSRF token
 * 
 * @param token CSRF token to validate
 * @returns Whether the token is valid
 */
export function validateCsrfToken(token: string): boolean {
  try {
    // Get the stored token from cookies
    const cookieStore = cookies();
    const storedToken = cookieStore.get(CSRF_COOKIE_NAME)?.value;
    
    // If no token is stored, validation fails
    if (!storedToken) {
      logger.warn('No CSRF token found in cookies');
      return false;
    }
    
    // If the token doesn't match, validation fails
    if (token !== storedToken) {
      logger.warn('CSRF token mismatch');
      return false;
    }
    
    // Parse the token parts
    const [randomToken, timestamp, signature] = storedToken.split('.');
    
    // Check if all parts exist
    if (!randomToken || !timestamp || !signature) {
      logger.warn('Invalid CSRF token format');
      return false;
    }
    
    // Verify the signature
    const expectedSignature = createHash('sha256')
      .update(`${randomToken}${timestamp}${CSRF_SECRET}`)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      logger.warn('Invalid CSRF token signature');
      return false;
    }
    
    // Check if the token has expired
    const tokenTime = parseInt(timestamp, 10);
    const currentTime = Date.now();
    
    if (currentTime - tokenTime > CSRF_EXPIRY) {
      logger.warn('CSRF token expired');
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Error validating CSRF token:', error);
    return false;
  }
}

/**
 * CSRF protection middleware for API routes
 * 
 * @param handler API route handler
 * @returns Protected API route handler
 */
export function csrfProtection(handler: Function) {
  return async (req: Request, ...args: any[]) => {
    // Skip CSRF check for GET and HEAD requests (they should be idempotent)
    if (req.method === 'GET' || req.method === 'HEAD') {
      return handler(req, ...args);
    }
    
    // Get the CSRF token from the request headers
    const csrfToken = req.headers.get('x-csrf-token');
    
    // If no token is provided, return 403 Forbidden
    if (!csrfToken) {
      logger.warn('CSRF token missing from request');
      return new Response(
        JSON.stringify({ error: 'CSRF token missing' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Validate the token
    if (!validateCsrfToken(csrfToken)) {
      logger.warn('CSRF validation failed');
      return new Response(
        JSON.stringify({ error: 'Invalid CSRF token' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // If the token is valid, proceed with the request
    return handler(req, ...args);
  };
} 
import { NextResponse } from 'next/server';
import { logger } from './logger';

/**
 * Standard API error response format
 */
export interface ApiError {
  error: string;
  message: string;
  status: number;
  details?: any;
}

/**
 * Standard API success response format
 */
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  message: string,
  status: number = 500,
  details?: any
): NextResponse<ApiError> {
  const error = {
    error: status === 400 ? 'Bad Request' :
           status === 401 ? 'Unauthorized' :
           status === 403 ? 'Forbidden' :
           status === 404 ? 'Not Found' :
           'Internal Server Error',
    message,
    status,
    details,
  };
  
  logger.error(`API Error: ${error.error} - ${message}`, details);
  
  return NextResponse.json(error, { status });
}

/**
 * Creates a standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  status: number = 200
): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({
    success: true,
    data,
  }, { status });
}

/**
 * Handles API errors in a consistent way
 */
export function handleApiError(error: unknown): NextResponse<ApiError> {
  logger.error('API error:', error);
  
  if (error instanceof Error) {
    return createErrorResponse(error.message);
  }
  
  return createErrorResponse('An unknown error occurred');
}

/**
 * Validates request data against a schema
 * This is a simple validation function - in a real app, you might use a library like Zod or Joi
 */
export function validateRequestData<T>(
  data: any,
  requiredFields: string[]
): { valid: true; data: T } | { valid: false; error: string } {
  if (!data) {
    return { valid: false, error: 'No data provided' };
  }
  
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }
  
  return { valid: true, data: data as T };
} 
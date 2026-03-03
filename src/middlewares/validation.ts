import type { Request, Response, NextFunction } from 'express';
import { type ZodSchema, ZodError } from 'zod';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation Failed',
          details: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        });
      }
      next(error);
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Invalid URL Parameters',
          details: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        });
      }
      next(error);
    }
  };
};

export const validateQueryParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Invalid Query Parameters',
          details: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        });
      }
      next(error);
    }
  };
};

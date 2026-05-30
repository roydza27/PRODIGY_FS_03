import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateBody =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Cast the parsed result as an object containing 'body' to make TypeScript happy
      const parsed = schema.parse({
        body: req.body,
      }) as { body: any };

      req.body = parsed.body;
      next();
    } catch (error) {
      next(error);
    }
  };
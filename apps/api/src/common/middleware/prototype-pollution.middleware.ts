import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const FORBIDDEN_KEYS = ['__proto__', 'constructor', 'prototype'];

function containsPrototypePollution(obj: any): boolean {
  if (!obj || typeof obj !== 'object') return false;

  for (const key of Object.keys(obj)) {
    if (FORBIDDEN_KEYS.includes(key.toLowerCase())) {
      return true;
    }
    const val = obj[key];
    if (val && typeof val === 'object') {
      if (containsPrototypePollution(val)) return true;
    }
  }
  return false;
}

@Injectable()
export class PrototypePollutionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.body && containsPrototypePollution(req.body)) {
      throw new BadRequestException('Security Violation: Prototype pollution payload detected.');
    }
    if (req.query && containsPrototypePollution(req.query)) {
      throw new BadRequestException('Security Violation: Invalid query parameters.');
    }
    next();
  }
}
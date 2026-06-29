import { Throttle } from '@nestjs/throttler';

// Strict rate for auth endpoints — 5 requests per 15 minutes
export const StrictThrottle = () =>
  Throttle({
    default: {
      ttl: 900000, // 15 minutes
      limit: 5,
    },
  });

// Moderate rate for write operations — 20 requests per minute
export const ModerateThrottle = () =>
  Throttle({
    default: {
      ttl: 60000,
      limit: 20,
    },
  });

// Relaxed rate for read operations — 60 requests per minute
export const RelaxedThrottle = () =>
  Throttle({
    default: {
      ttl: 60000,
      limit: 60,
    },
  });

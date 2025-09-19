
import rateLimit from "express-rate-limit";

/**
 * Rate limiter general - máximo 100 requisições por IP a cada 15 minutos
 */
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requisições
  message: {
    error: "Muitas requisições. Tente novamente em alguns minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter para login - máximo 5 tentativas por IP a cada 15 minutos
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas
  message: {
    error: "Muitas tentativas de login. Tente novamente em alguns minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

/**
 * Rate limiter para registro - máximo 3 tentativas por IP a cada hora
 */
export const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 tentativas
  message: {
    error: "Muitas tentativas de registro. Tente novamente em uma hora.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});
